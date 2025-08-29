// API Response Types for DTT Houses API

// Raw API response structure (what the API actually returns - direct array)
export interface ApiHouse {
  id: number
  image?: string
  price: number
  rooms: {
    bedrooms: number
    bathrooms: number
  }
  size: number
  description: string
  location: {
    street: string
    houseNumber: number
    houseNumberAddition: string | null
    city: string
    zip: string
  }
  createdAt?: string
  constructionYear: number
  hasGarage: boolean
  madeByMe?: boolean
}

// Server response wrapper (our server wraps the direct array response)
export interface ApiHousesResponse {
  value: ApiHouse[]
  Count: number
}

export interface CreateHouseRequest {
  price: number
  bedrooms: number
  bathrooms: number
  size: number
  streetName: string
  houseNumber: number
  numberAddition?: string
  zip: string
  city: string
  constructionYear: number
  hasGarage: boolean
  description: string
}

export interface CreatedId {
  id: number
}

export interface UpdateHouseRequest extends Partial<CreateHouseRequest> {
  id?: never // Prevent id in update payload
}

// Upload response type
export interface UploadResponse {
  message: string
  imageUrl: string
}

export interface UploadOk {
  ok: true
}
