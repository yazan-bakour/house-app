// API Response Types for DTT Houses API

// Raw API response structure (what the API actually returns - direct array)
export interface ApiHouse {
  id: number
  image: string
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
  createdAt: string
  constructionYear: number
  hasGarage: boolean
  madeByMe: boolean
}

// Server response wrapper (our server wraps the direct array response)
export interface ApiHousesResponse {
  value: ApiHouse[]
  Count: number
}

// Our normalized House interface (flat structure)
export interface House {
  id: number
  price: number
  bedrooms: number
  bathrooms: number
  size: number
  streetName: string
  houseNumber: string
  numberAddition?: string
  zip: string
  city: string
  constructionYear: number
  hasGarage: boolean
  description: string
  image?: string
  createdAt?: string
  madeByMe?: boolean
}

export interface CreateHouseRequest {
  price: number
  bedrooms: number
  bathrooms: number
  size: number
  streetName: string
  houseNumber: string
  numberAddition?: string
  zip: string
  city: string
  constructionYear: number
  hasGarage: boolean
  description: string
  image?: File
}

export interface UpdateHouseRequest extends Partial<CreateHouseRequest> {
  id?: never // Prevent id in update payload
}

export interface HouseSearchParams {
  search?: string
  minPrice?: number
  maxPrice?: number
  minSize?: number
  maxSize?: number
  bedrooms?: number
  bathrooms?: number
  hasGarage?: boolean
  page?: number
  limit?: number
}

export interface ApiError {
  message: string
  status: number
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

// Upload response type
export interface UploadResponse {
  message: string
  imageUrl: string
}
