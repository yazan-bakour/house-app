import { getRouterParam } from 'h3'
import { useDB } from '../../db'
import { houses } from '../../db/schema'
import { eq } from 'drizzle-orm'
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
    console.log(`🔄 Server: Fetching house ${id} from database...`)

    const db = useDB()
    const dbHouse = await db.select().from(houses).where(eq(houses.id, Number(id)))

    if (!dbHouse || dbHouse.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `House with ID ${id} not found`
      })
    }

    console.log(`✅ Server: Successfully fetched house ${id}`)

    const apiHouse = houseToApiHouse(dbHouse[0]!)
    return [apiHouse]

  } catch (error) {
    console.error(`❌ Server: Failed to fetch house ${id}:`, error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch house with ID ${id}`,
      data: error
    })
  }
})