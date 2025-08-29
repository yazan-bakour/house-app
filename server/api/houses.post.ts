import type { H3Event } from 'h3'
import type { CreateHouseRequest, CreatedId } from '~/types/api'
import type { FetchError } from 'ofetch'

function hasNumberId(u: unknown): u is CreatedId {
  if (typeof u !== 'object' || u === null) return false
  const rec = u as Record<string, unknown>
  return typeof rec.id === 'number'
}
export default defineEventHandler(async (event: H3Event): Promise<CreatedId> => {
  const config = useRuntimeConfig()
  const body = await readBody<CreateHouseRequest>(event)
  
  const {
    price,
    bedrooms,
    bathrooms,
    size,
    streetName,
    houseNumber,
    numberAddition,
    zip,
    city,
    constructionYear,
    hasGarage,
    description,
  } = body || {}
  if (
    price == null || bedrooms == null || bathrooms == null || size == null ||
    !streetName || houseNumber == null || !zip || !city ||
    constructionYear == null || hasGarage == null || !description
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }
  const payload = {
    price: Number(price),
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    size: Number(size),
    description: String(description),
    streetName: String(streetName),
    houseNumber: Number(houseNumber),
    numberAddition: numberAddition ? Number(numberAddition) : null,
    city: String(city),
    zip: String(zip),
    constructionYear: Number(constructionYear),
    hasGarage: hasGarage
  }
  
  try {
    const response = await $fetch<unknown>(config.dttApiUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': config.dttApiKey,
      },
      body: payload
    })

    if (!hasNumberId(response)) {
      throw createError({ statusCode: 502, statusMessage: 'Upstream did not return an id' })
    }

    return { id: response.id }

  } catch (error: unknown) {
    const fetchError = error as FetchError
    
    throw createError({
      statusCode: fetchError?.response?.status || 502,
      statusMessage: fetchError?.message || 'Failed to create house',
      data: fetchError
    })
  }
})