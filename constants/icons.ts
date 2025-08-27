/**
 * Application icon constants and mappings
 * Centralized configuration for all app icons
 */

// Navigation icons mapping
export const NAVIGATION_ICONS = {
  HOME: {
    DEFAULT: 'ic_mobile_navigarion_home@3x.png',
    ACTIVE: 'ic_mobile_navigarion_home_active@3x.png'
  },
  INFO: {
    DEFAULT: 'ic_mobile_navigarion_info@3x.png', 
    ACTIVE: 'ic_mobile_navigarion_info_active@3x.png'
  }
} as const

// App icons mapping
export const APP_ICONS = {
  LOGO: 'img_logo_dtt@3x.png',
  BACK_GREY: 'ic_back_grey@3x.png',
  BACK_WHITE: 'ic_back_white@3x.png',
  CLEAR: 'ic_clear@3x.png',
  CLEAR_WHITE: 'ic_clear_white@3x.png',
  DELETE: 'ic_delete@3x.png',
  DELETE_WHITE: 'ic_delete_white@3x.png',
  EDIT: 'ic_edit@3x.png',
  EDIT_WHITE: 'ic_edit_white@3x.png',
  PLUS_GREY: 'ic_plus_grey@3x.png',
  PLUS_WHITE: 'ic_plus_white@3x.png',
  SEARCH: 'ic_search@3x.png',
  UPLOAD: 'ic_upload@3x.png'
} as const

// House listing icons
export const HOUSE_ICONS = {
  BATH: 'ic_bath@3x.png',
  BED: 'ic_bed@3x.png', 
  GARAGE: 'ic_garage@3x.png',
  LOCATION: 'ic_location@3x.png',
  PRICE: 'ic_price@3x.png',
  SIZE: 'ic_size@3x.png',
  CONSTRUCTION_DATE: 'ic_construction_date@3x.png'
} as const

// Background images
export const IMAGES = {
  BACKGROUND: 'img_background@3x.png',
  EMPTY_HOUSES: 'img_empty_houses@3x.png',
  PLACEHOLDER_HOUSE: 'img_placeholder_house@3x.png'
} as const

// SVG icons
export const SVG_ICONS = {
  LOADER: 'svg/loader.svg',
  LOADER2: 'svg/loader2.svg'
} as const

// Type definitions for better TypeScript support
export type NavigationIconKey = keyof typeof NAVIGATION_ICONS
export type AppIconKey = keyof typeof APP_ICONS  
export type HouseIconKey = keyof typeof HOUSE_ICONS
export type ImageKey = keyof typeof IMAGES
export type SvgIconKey = keyof typeof SVG_ICONS

// Helper function to get asset path
export const getAssetPath = (iconPath: string): string => {
  return `/assets/${iconPath}`
}

// Icon size constants
export const ICON_SIZES = {
  XS: 12,
  SM: 16, 
  MD: 24,
  LG: 32,
  XL: 48
} as const

export type IconSize = keyof typeof ICON_SIZES
