// composables/useHouseImage.ts
import type { Ref } from 'vue'

/**
 * Composable for managing house images with lifecycle control
 * Provides reactive image URLs with validation and fallback
 */
export const useHouseImage = (imageUrl: Ref<string | undefined>) => {
  const imageSrc = ref<string>('')
  const isLoading = ref(true)
  const hasError = ref(false)

  // Helper function to validate image URL
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url?.trim()) return false
    return url.startsWith('http') || url.startsWith('/')
  }

  // Helper function to load placeholder
  const loadPlaceholder = async (): Promise<string> => {
    try {
      // Use the same pattern as iconLoader for static imports
      const module = await import('~/assets/img_placeholder_house@3x.png')
      return module.default
    } catch (error) {
      console.error('Failed to load placeholder image:', error)
      return '/assets/img_placeholder_house@3x.png' // Fallback path
    }
  }

  // Watch for changes in imageUrl and update imageSrc accordingly
  watchEffect(async () => {
    try {
      isLoading.value = true
      hasError.value = false

      if (isValidImageUrl(imageUrl.value)) {
        // Use the provided image URL
        imageSrc.value = imageUrl.value!
      } else {
        // Load placeholder image
        imageSrc.value = await loadPlaceholder()
      }

      isLoading.value = false
    } catch (error) {
      console.error('Failed to load house image:', error)
      hasError.value = true
      isLoading.value = false
      
      // Try to load placeholder as fallback
      try {
        imageSrc.value = await loadPlaceholder()
      } catch (placeholderError) {
        console.error('Failed to load placeholder:', placeholderError)
        imageSrc.value = '/assets/img_placeholder_house@3x.png'
      }
    }
  })

  return {
    imageSrc: readonly(imageSrc),
    isLoading: readonly(isLoading),
    hasError: readonly(hasError)
  }
}
