import { ref, computed } from 'vue'
import type { ApiHouse } from '~/types/api'

const FAVORITES_KEY = 'favoriteHouses'

// Global reactive state
const favoritesData = ref<ApiHouse[]>([])
let isInitialized = false

// Initialize from localStorage once
function initializeFavorites() {
  if (isInitialized) return
  
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)
    favoritesData.value = saved ? JSON.parse(saved) : []
  } catch (error) {
    console.warn('Failed to load favorites from localStorage:', error)
    favoritesData.value = []
  }
  
  isInitialized = true
}

// Save to localStorage
function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData.value))
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error)
  }
}

export function useFavorites() {
  // Initialize on first use
  if (!isInitialized) {
    initializeFavorites()
  }

  // Computed properties
  const favorites = computed(() => favoritesData.value)
  const count = computed(() => favoritesData.value.length)

  // Check if a house is in favorites
  function isFavorite(houseId?: number): boolean {
    if (!houseId) return false
    return favoritesData.value.some(house => house.id === houseId)
  }

  // Add house to favorites
  function add(house: ApiHouse): boolean {
    if (!house.id) {
      console.warn('Cannot add house to favorites: missing ID')
      return false
    }

    if (isFavorite(house.id)) {
      console.warn('House is already in favorites')
      return false
    }

    favoritesData.value.push(house)
    saveFavorites()
    return true
  }

  // Remove house from favorites
  function remove(houseId?: number): boolean {
    if (!houseId) {
      console.warn('Cannot remove house from favorites: missing ID')
      return false
    }

    const initialLength = favoritesData.value.length
    favoritesData.value = favoritesData.value.filter(house => house.id !== houseId)
    
    if (favoritesData.value.length !== initialLength) {
      saveFavorites()
      return true
    }
    
    return false
  }

  // Toggle favorite status
  function toggle(house: ApiHouse): 'added' | 'removed' | 'error' {
    if (!house.id) return 'error'

    if (isFavorite(house.id)) {
      return remove(house.id) ? 'removed' : 'error'
    } else {
      return add(house) ? 'added' : 'error'
    }
  }

  // Clear all favorites
  function clear(): void {
    favoritesData.value = []
    saveFavorites()
  }

  // Get favorite by ID
  function getFavorite(houseId: number): ApiHouse | undefined {
    return favoritesData.value.find(house => house.id === houseId)
  }

  return {
    favorites,
    count,
    isFavorite,
    add,
    remove,
    toggle,
    clear,
    getFavorite,
  }
}