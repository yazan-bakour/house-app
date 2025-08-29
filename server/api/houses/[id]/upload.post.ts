import type { H3Event, MultiPartData } from 'h3';
import { getRouterParam, readMultipartFormData } from 'h3'
import type { UploadResponse, UploadOk } from '~/types/api'
import type { FetchError } from 'ofetch'

function findImage(parts: MultiPartData[] | null | undefined): MultiPartData | null {
  if (!Array.isArray(parts)) return null
  return parts.find(p => p.name === 'image') ?? null
}

export default defineEventHandler(async (event: H3Event): Promise<UploadOk> => {
  const config = useRuntimeConfig()

  const houseId = getRouterParam(event, 'id')
  if (!houseId) throw createError({ statusCode: 400, statusMessage: 'Missing house ID parameter' })
  
  const parts = await readMultipartFormData(event)
  const file = findImage(parts)
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Missing image file (field name: image)' })
  }

  const fd = new FormData()
  const blob = new Blob([new Uint8Array(file.data)], { type: file.type || 'application/octet-stream' })
  fd.append('image', blob, file.filename || 'upload.jpg')

  try {
    await $fetch<UploadResponse>(`${config.dttApiUrl}/${encodeURIComponent(houseId)}/upload`, {
      method: 'POST',
      headers: {
        'X-API-Key': config.dttApiKey,
      },
      body: fd,
    })

    return { ok: true }
    
  } catch (error: unknown) {
    const fetchError = error as FetchError
    throw createError({
    statusCode: fetchError?.response?.status ?? 502,
    statusMessage: fetchError?.data?.message ?? 'Image upload failed',
    })
  }
})