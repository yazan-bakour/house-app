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
    if (!housesResponse.value?.value) {
      return []
    }
    return housesResponse.value.value
  })

  return {
    houses,
    loading: readonly(loading),
    error: readonly(error),
    refresh
  }
}
