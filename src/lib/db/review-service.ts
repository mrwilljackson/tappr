import supabase from '@/lib/supabase';
import { ReviewCreateInput } from '@/types/review';
import { v4 as uuidv4 } from 'uuid';

// Define Review type based on your Supabase table
export type Review = {
  id: number;
  review_id: string;
  brew_uuid: string;
  reviewer_id?: string;
  reviewer_name?: string;
  is_anonymous: boolean;
  review_date: string;
  review_type: string;
  quick_review: any;
  standard_review?: any;
  expert_review?: any;
  created_at: string;
  updated_at: string;
};

// Get all reviews from the database
export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

// Get a review by ID
export async function getReviewById(reviewId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('review_id', reviewId)
    .single();

  if (error) {
    console.error(`Error fetching review with ID ${reviewId}:`, error);
    return null;
  }

  return data;
}

// Get reviews by brew UUID
export async function getReviewsByBrewUuid(brewUuid: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('brew_uuid', brewUuid)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching reviews for brew UUID ${brewUuid}:`, error);
    return [];
  }

  return data || [];
}

// Create a new review
export async function createReview(data: ReviewCreateInput): Promise<Review | null> {
  // Prepare the review object with proper field names for Supabase
  const newReview = {
    review_id: uuidv4(),
    brew_uuid: data.brewUuid,
    reviewer_id: data.reviewerId,
    reviewer_name: data.reviewerName,
    is_anonymous: data.isAnonymous || false,
    review_date: new Date().toISOString(),
    review_type: data.reviewType,
    quick_review: data.quickReview,
    standard_review: data.standardReview,
    expert_review: data.expertReview,
  };

  const { data: result, error } = await supabase
    .from('reviews')
    .insert([newReview])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    return null;
  }

  return result;
}

// Update a review
export async function updateReview(reviewId: string, data: Partial<ReviewCreateInput>): Promise<Review | null> {
  // First check if the review exists
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) {
    return null;
  }

  // Prepare update data with proper field names for Supabase
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (data.reviewerId !== undefined) updateData.reviewer_id = data.reviewerId;
  if (data.reviewerName !== undefined) updateData.reviewer_name = data.reviewerName;
  if (data.isAnonymous !== undefined) updateData.is_anonymous = data.isAnonymous;
  if (data.reviewType !== undefined) updateData.review_type = data.reviewType;
  if (data.quickReview !== undefined) updateData.quick_review = data.quickReview;
  if (data.standardReview !== undefined) updateData.standard_review = data.standardReview;
  if (data.expertReview !== undefined) updateData.expert_review = data.expertReview;

  const { data: result, error } = await supabase
    .from('reviews')
    .update(updateData)
    .eq('review_id', reviewId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating review with ID ${reviewId}:`, error);
    return null;
  }

  return result;
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<boolean> {
  // First check if the review exists
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) {
    return false;
  }

  // Delete the review
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('review_id', reviewId);

  if (error) {
    console.error(`Error deleting review with ID ${reviewId}:`, error);
    return false;
  }

  return true;
}
