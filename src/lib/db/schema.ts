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

// Define the reviews table schema
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  reviewId: text('review_id').notNull().unique(),
  brewUuid: text('brew_uuid').notNull(),
  reviewerId: text('reviewer_id'),
  reviewerName: text('reviewer_name'),
  isAnonymous: integer('is_anonymous', { mode: 'boolean' }).notNull().default(false),
  reviewDate: text('review_date').notNull(),
  reviewType: text('review_type').notNull(),

  // Quick Review (stored as JSON)
  quickReview: text('quick_review', { mode: 'json' }).notNull(),

  // Standard Review (stored as JSON)
  standardReview: text('standard_review', { mode: 'json' }),

  // Expert Review (stored as JSON)
  expertReview: text('expert_review', { mode: 'json' }),

  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

// Export types for type safety
export type Beer = typeof beers.$inferSelect;
export type NewBeer = typeof beers.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
