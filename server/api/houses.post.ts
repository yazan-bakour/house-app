import type { H3Event } from 'h3'
import type { CreateHouseRequest, CreatedId } from '~/types/api'
import { useDB } from '../db'
import { houses } from '../db/schema'

export default defineEventHandler(async (event: H3Event): Promise<CreatedId> => {
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

  try {
    const db = useDB()

    const result = await db.insert(houses).values({
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      size: Number(size),
      description: String(description),
      streetName: String(streetName),
      houseNumber: Number(houseNumber),
      numberAddition: numberAddition || null,
      city: String(city),
      zip: String(zip),
      constructionYear: Number(constructionYear),
      hasGarage: Boolean(hasGarage),
      madeByMe: true,
    }).returning()

    if (!result[0]?.id) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to create house in database' })
    }

    return { id: result[0].id }

  } catch (error: unknown) {
    console.error('❌ Server: Failed to create house:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create house',
      data: error
    })
  }
})