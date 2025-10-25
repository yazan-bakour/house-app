/**
 * Cron job endpoint to clean up old house listings
 * Configure in Vercel to run daily at 2 AM UTC
 */

import { useDB } from '../../db'
import { houses } from '../../db/schema'
import { lt, sql } from 'drizzle-orm'
import { del } from '@vercel/blob'
import { unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // Verify cron secret for security (only Vercel cron can call this)
  const authHeader = getHeader(event, 'authorization')
  const config = useRuntimeConfig()

  // In production, Vercel sends a Bearer token
  if (config.cronSecret && authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    console.log('🧹 Cron: Starting cleanup of old house listings...')

    const db = useDB()

    // Delete houses older than 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    const timestamp = Math.floor(ninetyDaysAgo.getTime() / 1000)

    // Get houses to delete (to clean up images first)
    const housesToDelete = await db
      .select()
      .from(houses)
      .where(lt(houses.createdAt, sql`${timestamp}`))

    if (housesToDelete.length === 0) {
      console.log('✅ Cron: No houses to clean up')
      return {
        success: true,
        message: 'No houses to clean up',
        deletedCount: 0
      }
    }

    // Delete images (Vercel Blob or local files)
    const imageUrls = housesToDelete
      .map(h => h.image)
      .filter(Boolean) as string[]

    if (imageUrls.length > 0) {
      console.log(`🗑️  Cron: Deleting ${imageUrls.length} images...`)

      for (const url of imageUrls) {
        try {
          if (url.startsWith('/assets/uploads/')) {
            // Delete local file
            const filename = url.split('/').pop()
            if (filename) {
              const filePath = join(process.cwd(), 'public', 'assets', 'uploads', filename)
              await unlink(filePath)
              console.log(`✅ Cron: Deleted local file ${filename}`)
            }
          } else if (config.blobReadWriteToken) {
            // Delete from Vercel Blob
            await del(url, { token: config.blobReadWriteToken })
            console.log(`✅ Cron: Deleted Vercel Blob image`)
          }
        } catch (error) {
          console.warn(`⚠️  Cron: Failed to delete image ${url}:`, error)
          // Continue even if image deletion fails
        }
      }
    }

    // Delete houses from database
    const result = await db
      .delete(houses)
      .where(lt(houses.createdAt, sql`${timestamp}`))

    console.log(`✅ Cron: Successfully cleaned up ${housesToDelete.length} old house listings`)

    return {
      success: true,
      message: `Cleaned up ${housesToDelete.length} old house listings`,
      deletedCount: housesToDelete.length,
      imagesDeleted: imageUrls.length
    }

  } catch (error) {
    console.error('❌ Cron: Cleanup failed:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Cleanup failed',
      data: error
    })
  }
})
