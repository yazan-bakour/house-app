/**
 * Icon preloader plugin
 * Automatically preloads critical icons when the app starts
 */

import { preloadNavigationIcons } from '~/utils/iconLoader'

export default defineNuxtPlugin(async () => {
  // Only preload in browser environment
  if (typeof window !== 'undefined') {
    try {
      // Preload navigation icons on app start
      await preloadNavigationIcons()
      
      // You can add more icon preloading here for critical icons
      console.log('🎨 Icons preloaded successfully')
    } catch (error) {
      console.error('❌ Failed to preload icons:', error)
    }
  }
})
