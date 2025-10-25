import type { H3Event, MultiPartData } from 'h3'
import { getRouterParam, readMultipartFormData } from 'h3'
import type { UploadOk } from '~/types/api'
import { put } from '@vercel/blob'
import { useDB } from '../../../db'
import { houses } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { join } from 'path'

function findImage(parts: MultiPartData[] | null | undefined): MultiPartData | null {
  if (!Array.isArray(parts)) return null
  return parts.find(p => p.name === 'image') ?? null
}

export default defineEventHandler(async (event: H3Event): Promise<UploadOk> => {
  const config = useRuntimeConfig()
  const houseId = getRouterParam(event, 'id')

  if (!houseId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing house ID parameter' })
  }

  const parts = await readMultipartFormData(event)
  const file = findImage(parts)

  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Missing image file (field name: image)' })
  }

  try {
    console.log(`🔄 Server: Uploading image for house ${houseId}...`)

    let imageUrl: string

    // Check if Vercel Blob token is available
    if (config.blobReadWriteToken && config.blobReadWriteToken !== '') {
      // Production: Upload to Vercel Blob
      const filename = file.filename || `house-${houseId}-${Date.now()}.jpg`
      const blob = await put(filename, file.data, {
        access: 'public',
        token: config.blobReadWriteToken,
      })
      imageUrl = blob.url
      console.log(`✅ Server: Image uploaded to Vercel Blob:`, imageUrl)
    } else {
      // Development: Save locally to public/assets/uploads
      const filename = file.filename || `house-${houseId}-${Date.now()}.jpg`
      const uploadDir = join(process.cwd(), 'public', 'assets', 'uploads')
      const filePath = join(uploadDir, filename)

      // Ensure directory exists
      await writeFile(filePath, file.data)

      imageUrl = `/assets/uploads/${filename}`
      console.log(`✅ Server: Image saved locally:`, imageUrl)
    }

    // Update house with image URL
    const db = useDB()
    await db
      .update(houses)
      .set({ image: imageUrl })
      .where(eq(houses.id, Number(houseId)))

    console.log(`✅ Server: House ${houseId} updated with image URL`)

    return { ok: true }

  } catch (error: unknown) {
    console.error('❌ Server: Image upload failed:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Image upload failed',
      data: error
    })
  }
})