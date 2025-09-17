import type { ApiHouse, ApiHousesResponse } from '~/types/api'

export interface FetchHousesOptions {
  key?: string
  server?: boolean
  default?: () => ApiHousesResponse
}

export interface FetchSingleHouseOptions {
  key?: string
  server?: boolean
  default?: () => ApiHouse | null
}

export interface HousesComposableReturn {
  houses: ComputedRef<ApiHouse[]>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | null | undefined>>
  refresh: () => Promise<void>
  housesInitialized: Readonly<Ref<boolean>>
}

export interface SingleHouseComposableReturn {
  house: Readonly<Ref<ApiHouse | null>>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | null | undefined>>
  refresh: () => Promise<void>
}

/**
 * Composable for fetching the list of houses
 * @param options - Configuration options for the fetch
 * @returns Reactive houses data, loading state, error state, and refresh function
 */
export const useFetchHouses = (
  options: FetchHousesOptions = {}
): HousesComposableReturn => {
  const {
    key = 'houses-list',
    server = true,
    default: defaultFactory = () => ({ value: [], Count: 0 })
  } = options
  
  const housesInitialized = ref(false)

  const {
    data: housesResponse,
    pending: loading,
    error,
    refresh
  } = useFetch<ApiHousesResponse>('/api/houses', {
    key,
    server,
    default: defaultFactory
  })

  // Extract houses from response
  const houses = computed<ApiHouse[]>(() => {
    const response = unref(housesResponse)
    if (!response?.value || !Array.isArray(response.value)) {
      return []
    }
    return response.value
  })

  // Update initialized state when houses are available
  watch(houses, (newHouses) => {
    if (newHouses.length > 0) {
      housesInitialized.value = true
    }
  }, { immediate: true })

  return {
    houses,
    loading: readonly(loading),
    error: readonly(error),
    refresh,
    housesInitialized: readonly(housesInitialized)
  }
}
