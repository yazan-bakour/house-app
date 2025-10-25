import { getRouterParam } from 'h3'
import type { CreateHouseRequest } from '~/types/api'
import { useDB } from '../../db'
import { houses } from '../../db/schema'
import { eq, sql } from 'drizzle-orm'
import { houseToApiHouse } from '../../utils/transformers'

export default defineEventHandler(async (event) => {
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
    const db = useDB()

    // Check if house exists
    const existingHouse = await db.select().from(houses).where(eq(houses.id, Number(id)))

    if (!existingHouse || existingHouse.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `House with ID ${id} not found`
      })
    }

    // Update house
    const updated = await db.update(houses)
      .set({
        price: Number(body.price),
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        size: Number(body.size),
        description: String(body.description),
        streetName: String(body.streetName),
        houseNumber: Number(body.houseNumber),
        numberAddition: body.numberAddition || null,
        city: String(body.city),
        zip: String(body.zip),
        constructionYear: Number(body.constructionYear),
        hasGarage: Boolean(body.hasGarage),
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(houses.id, Number(id)))
      .returning()

    if (!updated || updated.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update house in database'
      })
    }

    console.log(`✅ Server: Successfully updated house ${id}`)

    return houseToApiHouse(updated[0]!)

  } catch (error: unknown) {
    console.error(`❌ Server: Failed to update house ${id}:`, error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update house',
      data: error
    })
  }
})