import { eq } from 'drizzle-orm';
import { getDb } from './index';
import { reviews, Review, NewReview } from './schema';
import { ReviewCreateInput } from '@/types/review';
import { v4 as uuidv4 } from 'uuid';

// Get all reviews from the database
export async function getAllReviews(): Promise<Review[]> {
  const db = getDb();
  return db.select().from(reviews).all();
}

// Get a review by ID
export async function getReviewById(reviewId: string): Promise<Review | undefined> {
  const db = getDb();
  const result = db.select().from(reviews).where(eq(reviews.reviewId, reviewId)).all();
  return result[0];
}

// Get reviews by brew UUID
export async function getReviewsByBrewUuid(brewUuid: string): Promise<Review[]> {
  const db = getDb();
  return db.select().from(reviews).where(eq(reviews.brewUuid, brewUuid)).all();
}

// Create a new review
export async function createReview(data: ReviewCreateInput): Promise<Review> {
  const db = getDb();
  
  const newReview: NewReview = {
    reviewId: uuidv4(),
    brewUuid: data.brewUuid,
    reviewerId: data.reviewerId,
    reviewerName: data.reviewerName,
    isAnonymous: data.isAnonymous || false,
    reviewDate: new Date().toISOString(),
    reviewType: data.reviewType,
    quickReview: data.quickReview,
    standardReview: data.standardReview,
    expertReview: data.expertReview,
  };
  
  const result = db.insert(reviews).values(newReview).returning().all();
  return result[0];
}

// Update a review
export async function updateReview(reviewId: string, data: Partial<ReviewCreateInput>): Promise<Review | undefined> {
  const db = getDb();
  
  // First check if the review exists
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) {
    return undefined;
  }
  
  // Update the review
  const updateData: Partial<NewReview> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  const result = db.update(reviews)
    .set(updateData)
    .where(eq(reviews.reviewId, reviewId))
    .returning()
    .all();
    
  return result[0];
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<boolean> {
  const db = getDb();
  
  // First check if the review exists
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) {
    return false;
  }
  
  // Delete the review
  db.delete(reviews).where(eq(reviews.reviewId, reviewId)).run();
  return true;
}
