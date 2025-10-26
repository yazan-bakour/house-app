import type { H3Event, MultiPartData } from 'h3'
import { getRouterParam, readMultipartFormData } from 'h3'
import type { UploadOk } from '~/types/api'
import { put } from '@vercel/blob'
import { useDB } from '../../../db'
import { houses } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

function findImage(parts: MultiPartData[] | null | undefined): MultiPartData | null {
  if (!Array.isArray(parts)) return null
  return parts.find(p => p.name === 'image') ?? null
}

/**
 * Generates a random filename with timestamp to prevent duplicates
 * Format: house-{houseId}-{timestamp}-{randomHash}.{extension}
 * Example: house-14-1709123456789-a3f2e1b9.jpg
 */
function generateRandomFilename(houseId: string, originalFilename?: string): string {
  const timestamp = Date.now()
  const randomHash = randomBytes(8).toString('hex') // 16 character random hash

  // Extract extension from original filename or default to jpg
  let extension = '.jpg'
  if (originalFilename) {
    const match = originalFilename.match(/\.(jpg|jpeg|png|webp)$/i)
    if (match) {
      extension = match[0].toLowerCase()
    }
  }

  return `house-${houseId}-${timestamp}-${randomHash}${extension}`
}

function validateImageFile(file: MultiPartData): { valid: boolean; error?: string } {
  // Check if file has data
  if (!file.data || file.data.length === 0) {
    return { valid: false, error: 'Image file is empty' }
  }

  // Check file size
  if (file.data.length > MAX_FILE_SIZE) {
    const sizeMB = (file.data.length / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `Image file is too large (${sizeMB}MB). Maximum size is 10MB`
    }
  }

  // Check file type by extension
  if (file.filename) {
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext =>
      file.filename?.toLowerCase().endsWith(ext)
    )
    if (!hasValidExtension) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
      }
    }
  }

  // Check MIME type
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid MIME type: ${file.type}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    }
  }

  return { valid: true }
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

  // Validate the image file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error || 'Invalid image file'
    })
  }

  try {
    let imageUrl: string

    // Check if Vercel Blob token is available
    if (config.blobReadWriteToken && config.blobReadWriteToken !== '') {
      const filename = generateRandomFilename(houseId, file.filename)

      const blob = await put(filename, file.data, {
        access: 'public',
        token: config.blobReadWriteToken,
      })
      imageUrl = blob.url
    } else {
      // Check if we're running in a serverless environment (Vercel)
      const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME

      if (isServerless) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Image upload requires BLOB_READ_WRITE_TOKEN in production',
          data: {
            message: 'Please add BLOB_READ_WRITE_TOKEN to your Vercel environment variables',
            instructions: 'Get a token from https://vercel.com/dashboard/stores'
          }
        })
      }

      // Development: Save locally to public/assets/uploads
      const filename = generateRandomFilename(houseId, file.filename)
      const uploadDir = join(process.cwd(), 'public', 'assets', 'uploads')
      const filePath = join(uploadDir, filename)

      // Ensure directory exists
      await writeFile(filePath, file.data)

      imageUrl = `/assets/uploads/${filename}`
    }

    // Update house with image URL
    const db = useDB()
    await db
      .update(houses)
      .set({ image: imageUrl })
      .where(eq(houses.id, Number(houseId)))

    return { ok: true }

  } catch (error: unknown) {
    console.error('❌ Server: Image upload failed:', error)

    // Extract more detailed error information
    let errorMessage = 'Image upload failed'
    interface ErrorDetails {
      name?: string
      message?: string
      stack?: string
      statusMessage?: string
      [key: string]: unknown
    }
    let errorDetails: ErrorDetails = {}

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    } else if (typeof error === 'object' && error !== null) {
      // Type guard for objects with message/statusMessage properties
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message
        errorDetails.message = error.message
      }
      if ('statusMessage' in error && typeof error.statusMessage === 'string') {
        errorMessage = error.statusMessage
        errorDetails.statusMessage = error.statusMessage
      }
      if ('name' in error && typeof error.name === 'string') {
        errorDetails.name = error.name
      }
    }

    console.error('📋 Server: Error details:', errorDetails)

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
      data: {
        ...errorDetails,
        hint: 'Check that BLOB_READ_WRITE_TOKEN is correctly set in Vercel environment variables'
      }
    })
  }
})