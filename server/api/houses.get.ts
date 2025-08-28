// Server-side API route to proxy DTT Houses API
// This avoids CORS issues by making the call server-side

import type { ApiHouse } from '~/types/api'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  
  try {
    console.log('🔄 Server: Fetching houses from DTT API...')
    
    // The DTT API returns an array directly, not wrapped in { value: [], Count: number }
    const response = await $fetch<ApiHouse[]>(config.dttApiUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': config.dttApiKey,
        'Content-Type': 'application/json'
      },
      retry: 2,
      retryDelay: 1000
    })

    console.log('✅ Server: Successfully fetched houses:', {
      count: response?.length || 0,
      firstHouse: response?.[0]?.id || 'none'
    })
    
    // Return wrapped response to match expected structure
    return {
      value: response,
      Count: response?.length || 0
    }
  } catch (error) {
    console.error('❌ Server: Failed to fetch houses:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch houses from external API',
      data: error
    })
  }
})