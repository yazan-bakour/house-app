/**
 * Optimized icon loader utility with caching and error handling
 */

import { NAVIGATION_ICONS, APP_ICONS, HOUSE_ICONS, IMAGES } from '~/constants/icons'

// Global icon cache to prevent duplicate imports
const iconCache = new Map<string, Promise<string>>()

// Static imports for better reliability (Vite will handle these properly)
const staticIconImports = {
  // Navigation icons
  'ic_mobile_navigarion_home@3x.png': () => import('~/assets/ic_mobile_navigarion_home@3x.png'),
  'ic_mobile_navigarion_home_active@3x.png': () => import('~/assets/ic_mobile_navigarion_home_active@3x.png'),
  'ic_mobile_navigarion_info@3x.png': () => import('~/assets/ic_mobile_navigarion_info@3x.png'),
  'ic_mobile_navigarion_info_active@3x.png': () => import('~/assets/ic_mobile_navigarion_info_active@3x.png'),
  
  // App icons
  'img_logo_dtt@3x.png': () => import('~/assets/img_logo_dtt@3x.png'),
  'ic_search@3x.png': () => import('~/assets/ic_search@3x.png'),
  'ic_edit@3x.png': () => import('~/assets/ic_edit@3x.png'),
  'ic_edit_white@3x.png': () => import('~/assets/ic_edit_white@3x.png'),
  'ic_delete@3x.png': () => import('~/assets/ic_delete@3x.png'),
  'ic_delete_white@3x.png': () => import('~/assets/ic_delete_white@3x.png'),
  'ic_plus_grey@3x.png': () => import('~/assets/ic_plus_grey@3x.png'),
  'ic_plus_white@3x.png': () => import('~/assets/ic_plus_white@3x.png'),
  'ic_back_grey@3x.png': () => import('~/assets/ic_back_grey@3x.png'),
  'ic_back_white@3x.png': () => import('~/assets/ic_back_white@3x.png'),
  'ic_clear@3x.png': () => import('~/assets/ic_clear@3x.png'),
  'ic_clear_white@3x.png': () => import('~/assets/ic_clear_white@3x.png'),
  'ic_upload@3x.png': () => import('~/assets/ic_upload@3x.png'),

  // House icons
  'ic_bath@3x.png': () => import('~/assets/ic_bath@3x.png'),
  'ic_bed@3x.png': () => import('~/assets/ic_bed@3x.png'),
  'ic_garage@3x.png': () => import('~/assets/ic_garage@3x.png'),
  'ic_location@3x.png': () => import('~/assets/ic_location@3x.png'),
  'ic_price@3x.png': () => import('~/assets/ic_price@3x.png'),
  'ic_size@3x.png': () => import('~/assets/ic_size@3x.png'),
  'ic_construction_date@3x.png': () => import('~/assets/ic_construction_date@3x.png'),

  // Images
  'img_background@3x.png': () => import('~/assets/img_background@3x.png'),
  'img_empty_houses@3x.png': () => import('~/assets/img_empty_houses@3x.png'),
  'img_placeholder_house@3x.png': () => import('~/assets/img_placeholder_house@3x.png'),

  // SVG icons
  'svg/loader.svg': () => import('~/assets/svg/loader.svg'),
  'svg/loader2.svg': () => import('~/assets/svg/loader2.svg'),
} as const

/**
 * Dynamically import an icon with caching
 */
export const loadIcon = async (iconPath: string): Promise<string> => {
  // Return cached promise if exists
  if (iconCache.has(iconPath)) {
    return iconCache.get(iconPath)!
  }

  // Create and cache the import promise
  const importPromise = (async () => {
    // Check if we have a static import for this icon
    if (iconPath in staticIconImports) {
      const importFn = staticIconImports[iconPath as keyof typeof staticIconImports]
      const module = await importFn()
      return module.default
    }

    // Fallback: return public asset path
    console.warn(`Icon not found in static imports, using public path: ${iconPath}`)
    return `/assets/${iconPath}`
  })()
    .catch(error => {
      console.error(`Failed to load icon: ${iconPath}`, error)
      // Remove failed import from cache so it can be retried
      iconCache.delete(iconPath)
      // Return fallback public path
      return `/assets/${iconPath}`
    })

  iconCache.set(iconPath, importPromise)
  return importPromise
}

/**
 * Preload multiple icons for better performance
 */
export const preloadIcons = async (iconPaths: string[]): Promise<PromiseSettledResult<string>[]> => {
  const loadPromises = iconPaths.map(path => loadIcon(path))
  return Promise.allSettled(loadPromises)
}

/**
 * Get navigation icon URL based on state
 */
export const getNavigationIcon = async (
  iconKey: keyof typeof NAVIGATION_ICONS,
  isActive: boolean = false
): Promise<string> => {
  const iconConfig = NAVIGATION_ICONS[iconKey]
  const iconPath = isActive ? iconConfig.ACTIVE : iconConfig.DEFAULT
  return loadIcon(iconPath)
}

/**
 * Get app icon URL
 */
export const getAppIcon = async (iconKey: keyof typeof APP_ICONS): Promise<string> => {
  const iconPath = APP_ICONS[iconKey]
  return loadIcon(iconPath)
}

/**
 * Get house icon URL
 */
export const getHouseIcon = async (iconKey: keyof typeof HOUSE_ICONS): Promise<string> => {
  const iconPath = HOUSE_ICONS[iconKey]
  return loadIcon(iconPath)
}

/**
 * Get image URL
 */
export const getImage = async (imageKey: keyof typeof IMAGES): Promise<string> => {
  const imagePath = IMAGES[imageKey]
  return loadIcon(imagePath)
}

/**
 * Preload all navigation icons
 */
export const preloadNavigationIcons = async (): Promise<void> => {
  const iconPaths: string[] = Object.values(NAVIGATION_ICONS).flatMap(config => [
    config.DEFAULT,
    config.ACTIVE
  ])
  
  // Add logo
  iconPaths.push(APP_ICONS.LOGO)
  
  try {
    await preloadIcons(iconPaths)
    console.log('Navigation icons preloaded successfully')
  } catch (error) {
    console.error('Failed to preload navigation icons:', error)
  }
}

/**
 * Clear icon cache (useful for development/testing)
 */
export const clearIconCache = (): void => {
  iconCache.clear()
}

/**
 * Get cache stats for debugging
 */
export const getIconCacheStats = () => {
  return {
    size: iconCache.size,
    keys: Array.from(iconCache.keys())
  }
}
