import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const houses = sqliteTable('houses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  price: integer('price').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  size: integer('size').notNull(),
  streetName: text('street_name').notNull(),
  houseNumber: integer('house_number').notNull(),
  numberAddition: text('number_addition'),
  zip: text('zip').notNull(),
  city: text('city').notNull(),
  constructionYear: integer('construction_year').notNull(),
  hasGarage: integer('has_garage', { mode: 'boolean' }).notNull(),
  description: text('description').notNull(),
  image: text('image'),
  madeByMe: integer('made_by_me', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type House = typeof houses.$inferSelect
export type NewHouse = typeof houses.$inferInsert
