// composables/useIcons.ts
import type { Ref } from 'vue'
import { getNavigationIcon, getAppIcon, preloadNavigationIcons } from '~/utils/iconLoader'
import type { APP_ICONS } from '~/constants/icons'

export type NavigationIconName = 'home' | 'info'
export type AppIconName = keyof typeof APP_ICONS

/**
 * Composable for managing application icons
 * Provides reactive icon URLs with caching and preloading
 */
export const useIcons = () => {
  /**
   * Get reactive navigation icon URL that updates based on active state
   */
  const useNavigationIcon = (iconName: NavigationIconName, isActive: Ref<boolean>) => {
    const iconUrl = ref<string>('')

    // Map icon names to constants
    const iconKeyMap = {
      home: 'HOME' as const,
      info: 'INFO' as const
    }

    // Watch for changes and update icon
    watchEffect(async () => {
      try {
        const iconKey = iconKeyMap[iconName]
        iconUrl.value = await getNavigationIcon(iconKey, isActive.value)
      } catch (error) {
        console.error(`Failed to load navigation icon: ${iconName}`, error)
        iconUrl.value = ''
      }
    })

    return iconUrl
  }

  /**
   * Get reactive app icon URL
   */
  const useAppIcon = (iconName: AppIconName) => {
    const iconUrl = ref<string>('')

    onMounted(async () => {
      try {
        iconUrl.value = await getAppIcon(iconName)
      } catch (error) {
        console.error(`Failed to load app icon: ${iconName}`, error)
        iconUrl.value = ''
      }
    })

    return iconUrl
  }

  /**
   * Preload navigation icons on component mount
   */
  const useIconPreloader = () => {
    onMounted(() => {
      preloadNavigationIcons()
    })
  }

  return {
    useNavigationIcon,
    useAppIcon,
    useIconPreloader
  }
}
