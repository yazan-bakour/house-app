import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { houses } from './schema'

// Load environment variables from .env file
config()

// Validate environment variables
if (!process.env.TURSO_DB_URL || process.env.TURSO_DB_URL === 'PASTE_YOUR_TURSO_URL_HERE') {
  console.error('❌ Error: TURSO_DB_URL is not set in .env file')
  console.error('Please add your Turso database URL to .env file')
  console.error('Get it from: https://turso.tech/')
  process.exit(1)
}

if (!process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN === 'PASTE_YOUR_TURSO_TOKEN_HERE') {
  console.error('❌ Error: TURSO_AUTH_TOKEN is not set in .env file')
  console.error('Please add your Turso auth token to .env file')
  console.error('Get it from: https://turso.tech/')
  process.exit(1)
}

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client)

const defaultHouses = [
  {
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    size: 120,
    streetName: 'Kerkstraat',
    houseNumber: 42,
    numberAddition: null,
    zip: '1012 GK',
    city: 'Amsterdam',
    constructionYear: 1995,
    hasGarage: true,
    description: 'Beautiful family home in the heart of Amsterdam. This charming property features a spacious living room, modern kitchen, and a lovely garden. Perfect for families looking for a comfortable home in a vibrant neighborhood.',
    image: '/assets/houses/house3.jpg',
    madeByMe: true,
  },
  {
    price: 325000,
    bedrooms: 2,
    bathrooms: 1,
    size: 85,
    streetName: 'Hoofdweg',
    houseNumber: 15,
    numberAddition: 'A',
    zip: '3011 AB',
    city: 'Rotterdam',
    constructionYear: 2005,
    hasGarage: false,
    description: 'Cozy apartment located in a quiet neighborhood of Rotterdam. Features include an open kitchen, balcony with city views, and modern finishes throughout. Close to public transport and local amenities.',
    image: '/assets/houses/house4.jpg',
    madeByMe: true,
  },
  {
    price: 585000,
    bedrooms: 4,
    bathrooms: 3,
    size: 165,
    streetName: 'Gracht',
    houseNumber: 28,
    numberAddition: null,
    zip: '3511 BK',
    city: 'Utrecht',
    constructionYear: 2010,
    hasGarage: true,
    description: 'Luxurious canal house in Utrecht with stunning water views. This spacious home offers high-end finishes, multiple bedrooms, and a rooftop terrace. An ideal property for those seeking elegance and comfort.',
    image: '/assets/houses/1126806.jpg',
    madeByMe: true,
  },
  {
    price: 275000,
    bedrooms: 2,
    bathrooms: 1,
    size: 75,
    streetName: 'Dorpsstraat',
    houseNumber: 103,
    numberAddition: null,
    zip: '2012 CD',
    city: 'Haarlem',
    constructionYear: 1985,
    hasGarage: false,
    description: 'Charming starter home in Haarlem with lots of potential. Features a bright living room, compact kitchen, and small garden. Perfect for first-time buyers or investors looking for a renovation project.',
    image: '/assets/houses/1403962.jpg',
    madeByMe: true,
  },
  {
    price: 675000,
    bedrooms: 5,
    bathrooms: 3,
    size: 200,
    streetName: 'Wilhelminalaan',
    houseNumber: 8,
    numberAddition: null,
    zip: '2595 AK',
    city: 'Den Haag',
    constructionYear: 2015,
    hasGarage: true,
    description: 'Stunning modern villa in The Hague. This impressive property boasts a spacious layout, contemporary design, private garden with pool, and high-end appliances. Located in one of the most prestigious neighborhoods.',
    image: '/assets/houses/2784291.jpg',
    madeByMe: true,
  },
  {
    price: 395000,
    bedrooms: 3,
    bathrooms: 2,
    size: 110,
    streetName: 'Stationsweg',
    houseNumber: 67,
    numberAddition: 'B',
    zip: '5611 AB',
    city: 'Eindhoven',
    constructionYear: 2000,
    hasGarage: true,
    description: 'Well-maintained townhouse near Eindhoven central station. Features include three bedrooms, modern bathroom, and a sunny backyard. Excellent connectivity to the city center and amenities.',
    image: '/assets/houses/4218173.jpg',
    madeByMe: true,
  },
  {
    price: 520000,
    bedrooms: 4,
    bathrooms: 2,
    size: 145,
    streetName: 'Parklaan',
    houseNumber: 22,
    numberAddition: null,
    zip: '6511 WN',
    city: 'Nijmegen',
    constructionYear: 2008,
    hasGarage: true,
    description: 'Spacious family home located near a beautiful park in Nijmegen. The property features a large living area, modern kitchen with appliances, four bedrooms, and a landscaped garden. Ideal for growing families.',
    image: '/assets/houses/4218435.jpg',
    madeByMe: true,
  },
  {
    price: 310000,
    bedrooms: 2,
    bathrooms: 1,
    size: 90,
    streetName: 'Marktstraat',
    houseNumber: 45,
    numberAddition: null,
    zip: '7511 AB',
    city: 'Enschede',
    constructionYear: 1998,
    hasGarage: false,
    description: 'Central apartment in Enschede with easy access to shops and restaurants. This well-maintained unit offers two bedrooms, an open-plan living area, and a balcony. Perfect for young professionals or couples.',
    image: '/assets/houses/84564.jpg',
    madeByMe: true,
  },
]

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Insert default houses
    const result = await db.insert(houses).values(defaultHouses).returning()

    console.log(`✅ Successfully seeded ${result.length} houses`)
    console.log('Houses:', result.map((h) => `${h.id}: ${h.streetName} ${h.houseNumber}, ${h.city}`))
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

seed()
