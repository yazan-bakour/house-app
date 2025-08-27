// composables/useImageLoader.ts
export const useImageLoader = (source: MaybeRef<string | undefined>) => {
  const isLoading = ref(true)
  const imageUrl = ref<string>('')
  const hasError = ref(false)
  
  const loadImage = async (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => resolve(src)
      img.onerror = () => reject(new Error(`Failed to load: ${src}`))
      
      img.src = src
    })
  }
  
  watchEffect(async () => {
    const src = unref(source)
    
    if (!src) {
      isLoading.value = false
      imageUrl.value = ''
      return
    }
    
    isLoading.value = true
    hasError.value = false
    
    try {
      // Check if it's an icon path or external URL
      const finalUrl = src.startsWith('http') 
        ? src 
        : await loadIcon(src) // Use existing icon loader for local assets
      
      // Pre-load the image
      await loadImage(finalUrl)
      
      imageUrl.value = finalUrl
      hasError.value = false
    } catch (error) {
      console.error('Image load error:', error)
      hasError.value = true
      imageUrl.value = ''
    } finally {
      isLoading.value = false
    }
  })
  
  return {
    imageUrl: readonly(imageUrl),
    isLoading: readonly(isLoading),
    hasError: readonly(hasError)
  }
}