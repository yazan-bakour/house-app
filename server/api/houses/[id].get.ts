import { getRouterParam } from 'h3'
import type { ApiHouse } from '~/types/api'

interface FetchError {
  response?: {
    status?: number
  }
  message?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Missing house ID parameter' 
    })
  }

  try {
    console.log(`🔄 Server: Fetching house ${id} from DTT API...`)
    
    const response = await $fetch<ApiHouse>(`${config.dttApiUrl}/${id}`, {
      method: 'GET',
      headers: {
        'X-API-Key': config.dttApiKey,
        'Content-Type': 'application/json'
      },
      retry: 2,
      retryDelay: 1000
    })

    console.log(`✅ Server: Successfully fetched house ${id}`)
    return response
    
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error(`❌ Server: Failed to fetch house ${id}:`, fetchError)
    
    // Handle different error types
    if (fetchError?.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: `House with ID ${id} not found`
      })
    }
    
    throw createError({
      statusCode: fetchError?.response?.status || 500,
      statusMessage: fetchError?.message || 'Failed to fetch house from external API',
      data: fetchError
    })
  }
})