import { getRouterParam } from 'h3'
import type { FetchError } from 'ofetch'

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
    
    await $fetch(`${config.dttApiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': config.dttApiKey,
        'Content-Type': 'application/json'
      },
      retry: 2,
      retryDelay: 1000
    })

    return { success: true, message: 'House deleted successfully' }
    
  } catch (error: unknown) {
    const fetchError = error as FetchError
    
    // Handle different error types
    if (fetchError?.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: `House with ID ${id} not found`
      })
    }
    
    if (fetchError?.response?.status === 403) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only delete your own listings'
      })
    }
    
    throw createError({
      statusCode: fetchError?.response?.status || 500,
      statusMessage: fetchError?.message || 'Failed to delete house',
      data: fetchError
    })
  }
})