import { getRouterParam } from 'h3'
import { useDB } from '../../db'
import { houses } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing house ID parameter'
    })
  }

  try {
    console.log(`🔄 Server: Deleting house ${id}...`)

    const db = useDB()

    // Check if house exists
    const existingHouse = await db.select().from(houses).where(eq(houses.id, Number(id)))

    if (!existingHouse || existingHouse.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `House with ID ${id} not found`
      })
    }

    // Delete the house
    await db.delete(houses).where(eq(houses.id, Number(id)))

    console.log(`✅ Server: Successfully deleted house ${id}`)

    return { success: true, message: 'House deleted successfully' }

  } catch (error: unknown) {
    console.error(`❌ Server: Failed to delete house ${id}:`, error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete house',
      data: error
    })
  }
})