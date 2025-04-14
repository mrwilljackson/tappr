import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Define the beers table schema
export const beers = sqliteTable('beers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  style: text('style').notNull(),
  abv: real('abv').notNull(),
  ibu: integer('ibu'),
  description: text('description'),
  brewDate: text('brew_date').notNull(),
  kegLevel: integer('keg_level').notNull().default(100),
  brewUuid: text('brew_uuid').notNull(),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

// Export types for type safety
export type Beer = typeof beers.$inferSelect;
export type NewBeer = typeof beers.$inferInsert;
