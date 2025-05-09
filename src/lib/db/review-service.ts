import supabase from '@/lib/supabase';
import { ReviewCreateInput } from '@/types/review';
import { v4 as uuidv4 } from 'uuid';

// Define Review type based on your Supabase table
export type Review = {
  id: number;
  review_id: string;
  api_brew_uuid: string;  // Primary reference to the brew in the API database
  brew_uuid?: string;     // Optional reference to the brew in the companion app
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

// Get reviews by API brew UUID (primary reference)
export async function getReviewsByApiBrewUuid(apiBrewUuid: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('api_brew_uuid', apiBrewUuid)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching reviews for API brew UUID ${apiBrewUuid}:`, error);
    return [];
  }

  return data || [];
}

// Get reviews by companion app brew UUID (for backward compatibility)
export async function getReviewsByBrewUuid(brewUuid: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('brew_uuid', brewUuid)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching reviews for companion app brew UUID ${brewUuid}:`, error);
    return [];
  }

  return data || [];
}

// Create a new review
export async function createReview(data: ReviewCreateInput): Promise<Review | null> {
  // Prepare the review object with proper field names for Supabase
  const newReview = {
    review_id: uuidv4(),
    api_brew_uuid: data.apiBrewUuid,  // Primary reference to the brew
    brew_uuid: data.brewUuid,         // Optional reference for the companion app
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

// Get average review score for a specific brew
export async function getAverageReviewScore(apiBrewUuid: string): Promise<{ averageScore: number; reviewCount: number } | null> {
  try {
    // Get all reviews for the brew
    const reviews = await getReviewsByApiBrewUuid(apiBrewUuid);

    // If no reviews, return null
    if (!reviews || reviews.length === 0) {
      return null;
    }

    // Calculate the average score
    let totalScore = 0;

    // Process each review based on its type
    for (const review of reviews) {
      let reviewScore = 0;

      // For quick reviews, use the overallRating
      if (review.review_type === 'quick' && review.quick_review) {
        reviewScore = review.quick_review.overallRating;
      }
      // For standard reviews, calculate the average of all rating fields or use calculatedScore if available
      else if (review.review_type === 'standard' && review.standard_review) {
        if (review.standard_review.calculatedScore !== undefined) {
          reviewScore = review.standard_review.calculatedScore;
        } else {
          const standardReview = review.standard_review;
          reviewScore = (
            standardReview.appearance +
            standardReview.aroma +
            standardReview.taste +
            standardReview.mouthfeel
          ) / 4;
        }
      }
      // For expert reviews, use a more complex calculation or use calculatedScore if available
      else if (review.review_type === 'expert' && review.expert_review) {
        if (review.expert_review.calculatedScore !== undefined) {
          reviewScore = review.expert_review.calculatedScore;
        } else {
          // For expert reviews without calculatedScore, we'll use the quick review's overallRating
          // as a fallback since the expert calculation is complex
          reviewScore = review.quick_review ? review.quick_review.overallRating : 0;
        }
      }

      totalScore += reviewScore;
    }

    // Calculate the average score with two decimal places
    const averageScore = Math.round((totalScore / reviews.length) * 100) / 100;

    return {
      averageScore,
      reviewCount: reviews.length
    };
  } catch (error) {
    console.error(`Error calculating average review score for brew ${apiBrewUuid}:`, error);
    return null;
  }
}
