import { getRouterParam } from 'h3'
import type { ApiHouse, CreateHouseRequest } from '~/types/api'
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
    console.log(`🔄 Server: Updating house ${id}...`)

    const body = await readBody<CreateHouseRequest>(event)
    
    const formData = new FormData()
    formData.append('price', body.price.toString())
    formData.append('bedrooms', body.bedrooms.toString())
    formData.append('bathrooms', body.bathrooms.toString())
    formData.append('size', body.size.toString())
    formData.append('streetName', body.streetName)
    formData.append('houseNumber', body.houseNumber.toString())
    formData.append('numberAddition', body.numberAddition || '')
    formData.append('zip', body.zip)
    formData.append('city', body.city)
    formData.append('constructionYear', body.constructionYear.toString())
    formData.append('hasGarage', body.hasGarage.toString())
    formData.append('description', body.description)

    const response = await $fetch<ApiHouse>(`${config.dttApiUrl}/${id}`, {
      method: 'POST',
      headers: {
        'X-API-Key': config.dttApiKey,
      },
      body: formData,
      retry: 2,
      retryDelay: 1000
    })

    return response
    
  } catch (error: unknown) {
    const fetchError = error as FetchError
    
    // Handle different error types
    if (fetchError?.response?.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: `House with ID ${id} not found`
      })
    }
    
    throw createError({
      statusCode: fetchError?.response?.status || 500,
      statusMessage: fetchError?.message || 'Failed to update house',
      data: fetchError
    })
  }
})