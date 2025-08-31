import { ref, computed } from 'vue'
import type { ApiHouse } from '~/types/api'

const HISTORY_KEY = 'viewedHouses'

// Global reactive state
const historyData = ref<ApiHouse[]>([])
let isInitialized = false

// Initialize from localStorage once
function initializeHistory() {
  if (isInitialized) return
  
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    historyData.value = saved ? JSON.parse(saved) : []
  } catch (error) {
    console.warn('Failed to load history from localStorage:', error)
    historyData.value = []
  }
  
  isInitialized = true
}

// Save to localStorage
function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData.value))
  } catch (error) {
    console.error('Failed to save history to localStorage:', error)
  }
}

export function useHistory() {
  // Initialize on first use
  if (!isInitialized) {
    initializeHistory()
  }

  // Computed properties
  const history = computed(() => historyData.value)
  const count = computed(() => historyData.value.length)

  // Add house to history (most recent first)
  function add(house: ApiHouse): boolean {
    if (!house.id) return false

    // Remove if already exists to avoid duplicates
    historyData.value = historyData.value.filter(h => h.id !== house.id)
    
    // Add to beginning (most recent first)
    historyData.value.unshift(house)
    
    saveHistory()
    return true
  }

  // Remove house from history
  function remove(houseId?: number): boolean {
    if (!houseId) return false

    const initialLength = historyData.value.length
    historyData.value = historyData.value.filter(house => house.id !== houseId)
    
    if (historyData.value.length !== initialLength) {
      saveHistory()
      return true
    }
    
    return false
  }

  return {
    history,
    count,
    add,
    remove,
  }
}