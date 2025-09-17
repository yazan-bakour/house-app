import { ref, computed, readonly } from 'vue'
import type { ApiHouse } from '~/types/api'

export interface FilterOptions {
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minSize?: number
  maxSize?: number
  city?: string
  zip?: string
}

export function useFilter(houses: Ref<ApiHouse[]>) {
  const appliedFilters = ref<FilterOptions>({})
  const pendingFilters = ref<FilterOptions>({})

  const filtered = computed(() => {
    if (!houses.value) return []
    
    return houses.value.filter((house) => {
      if (appliedFilters.value.minPrice && house.price < appliedFilters.value.minPrice) return false
      if (appliedFilters.value.maxPrice && house.price > appliedFilters.value.maxPrice) return false
      if (appliedFilters.value.bedrooms && house.rooms.bedrooms !== appliedFilters.value.bedrooms) return false
      if (appliedFilters.value.bathrooms && house.rooms.bathrooms !== appliedFilters.value.bathrooms) return false
      if (appliedFilters.value.minSize && house.size < appliedFilters.value.minSize) return false
      if (appliedFilters.value.maxSize && house.size > appliedFilters.value.maxSize) return false
      if (appliedFilters.value.city && house.location.city !== appliedFilters.value.city) return false
      if (appliedFilters.value.zip && house.location.zip !== appliedFilters.value.zip) return false
      return true
    })
  })

  function updatePendingFilters(newFilters: FilterOptions) {
    pendingFilters.value = { ...newFilters }
  }

  function applyFilters() {
    appliedFilters.value = { ...pendingFilters.value }
  }

  function resetFilters() {
    pendingFilters.value = {}
    appliedFilters.value = {}
  }

  return {
    pendingFilters: readonly(pendingFilters),
    appliedFilters: readonly(appliedFilters),
    filtered,
    updatePendingFilters,
    applyFilters,
    resetFilters,
  }
}