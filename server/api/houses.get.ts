// Server-side API route to get all houses from database

import { useDB } from '../db'
import { houses } from '../db/schema'
import { desc } from 'drizzle-orm'
import { houseToApiHouse } from '../utils/transformers'

export default defineEventHandler(async () => {
  try {
    console.log('🔄 Server: Fetching houses from database...')

    const db = useDB()
    const dbHouses = await db.select().from(houses).orderBy(desc(houses.createdAt))

    const apiHouses = dbHouses.map(houseToApiHouse)

    console.log('✅ Server: Successfully fetched houses:', {
      count: apiHouses.length,
      firstHouse: apiHouses[0]?.id || 'none'
    })

    // Return wrapped response to match expected structure
    return {
      value: apiHouses,
      Count: apiHouses.length
    }
  } catch (error) {
    console.error('❌ Server: Failed to fetch houses:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch houses from database',
      data: error
    })
  }
})