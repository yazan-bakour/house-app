import type { House } from '../db/schema'
import type { ApiHouse } from '~/types/api'

/**
 * Transform database house record to API response format
 */
export function houseToApiHouse(house: House): ApiHouse {
  return {
    id: house.id,
    image: house.image || undefined,
    price: house.price,
    rooms: {
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
    },
    size: house.size,
    description: house.description,
    location: {
      street: house.streetName,
      houseNumber: house.houseNumber,
      houseNumberAddition: house.numberAddition,
      city: house.city,
      zip: house.zip,
    },
    createdAt: house.createdAt ? house.createdAt.toISOString() : undefined,
    constructionYear: house.constructionYear,
    hasGarage: house.hasGarage,
    madeByMe: house.madeByMe,
  }
}
