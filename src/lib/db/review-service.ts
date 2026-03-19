import sql from '@/lib/neon';
import { ReviewCreateInput } from '@/types/review';
import { v4 as uuidv4 } from 'uuid';

export type Review = {
  id: number;
  review_id: string;
  api_brew_uuid: string;
  brew_uuid?: string;
  reviewer_id?: string;
  reviewer_name?: string;
  is_anonymous: boolean;
  review_date: string;
  review_type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quick_review: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  standard_review?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expert_review?: any;
  created_at: string;
  updated_at: string;
};

export async function getAllReviews(): Promise<Review[]> {
  try {
    const result = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
    return result as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getReviewById(reviewId: string): Promise<Review | null> {
  try {
    const result = await sql`SELECT * FROM reviews WHERE review_id = ${reviewId}`;
    return (result[0] as Review) || null;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewId}:`, error);
    return null;
  }
}

export async function getReviewsByApiBrewUuid(apiBrewUuid: string): Promise<Review[]> {
  try {
    const result = await sql`
      SELECT * FROM reviews WHERE api_brew_uuid = ${apiBrewUuid} ORDER BY created_at DESC
    `;
    return result as Review[];
  } catch (error) {
    console.error(`Error fetching reviews for API brew UUID ${apiBrewUuid}:`, error);
    return [];
  }
}

export async function getReviewsByBrewUuid(brewUuid: string): Promise<Review[]> {
  try {
    const result = await sql`
      SELECT * FROM reviews WHERE brew_uuid = ${brewUuid} ORDER BY created_at DESC
    `;
    return result as Review[];
  } catch (error) {
    console.error(`Error fetching reviews for brew UUID ${brewUuid}:`, error);
    return [];
  }
}

export async function createReview(data: ReviewCreateInput): Promise<Review | null> {
  const review_id       = uuidv4();
  const api_brew_uuid   = data.apiBrewUuid;
  const brew_uuid       = data.brewUuid      ?? null;
  const reviewer_id     = data.reviewerId    ?? null;
  const reviewer_name   = data.reviewerName  ?? null;
  const is_anonymous    = data.isAnonymous   ?? false;
  const review_date     = new Date().toISOString();
  const review_type     = data.reviewType;
  const quick_review    = JSON.stringify(data.quickReview);
  const standard_review = data.standardReview ? JSON.stringify(data.standardReview) : null;
  const expert_review   = data.expertReview   ? JSON.stringify(data.expertReview)   : null;

  try {
    const result = await sql`
      INSERT INTO reviews
        (review_id, api_brew_uuid, brew_uuid, reviewer_id, reviewer_name,
         is_anonymous, review_date, review_type, quick_review, standard_review, expert_review)
      VALUES
        (${review_id}, ${api_brew_uuid}, ${brew_uuid}, ${reviewer_id}, ${reviewer_name},
         ${is_anonymous}, ${review_date}, ${review_type},
         ${quick_review}, ${standard_review}, ${expert_review})
      RETURNING *
    `;
    return (result[0] as Review) || null;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
}

export async function updateReview(reviewId: string, data: Partial<ReviewCreateInput>): Promise<Review | null> {
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) return null;

  const reviewer_id     = data.reviewerId   !== undefined ? data.reviewerId   : existingReview.reviewer_id;
  const reviewer_name   = data.reviewerName !== undefined ? data.reviewerName : existingReview.reviewer_name;
  const is_anonymous    = data.isAnonymous  !== undefined ? data.isAnonymous  : existingReview.is_anonymous;
  const review_type     = data.reviewType   !== undefined ? data.reviewType   : existingReview.review_type;
  const quick_review    = data.quickReview    !== undefined ? JSON.stringify(data.quickReview)    : JSON.stringify(existingReview.quick_review);
  const standard_review = data.standardReview !== undefined ? JSON.stringify(data.standardReview) : (existingReview.standard_review ? JSON.stringify(existingReview.standard_review) : null);
  const expert_review   = data.expertReview   !== undefined ? JSON.stringify(data.expertReview)   : (existingReview.expert_review   ? JSON.stringify(existingReview.expert_review)   : null);

  try {
    const result = await sql`
      UPDATE reviews
      SET reviewer_id = ${reviewer_id}, reviewer_name = ${reviewer_name},
          is_anonymous = ${is_anonymous}, review_type = ${review_type},
          quick_review = ${quick_review}, standard_review = ${standard_review},
          expert_review = ${expert_review}, updated_at = NOW()
      WHERE review_id = ${reviewId}
      RETURNING *
    `;
    return (result[0] as Review) || null;
  } catch (error) {
    console.error(`Error updating review with ID ${reviewId}:`, error);
    return null;
  }
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) return false;

  try {
    await sql`DELETE FROM reviews WHERE review_id = ${reviewId}`;
    return true;
  } catch (error) {
    console.error(`Error deleting review with ID ${reviewId}:`, error);
    return false;
  }
}

export async function getAverageReviewScore(apiBrewUuid: string): Promise<{ averageScore: number; reviewCount: number } | null> {
  try {
    const reviews = await getReviewsByApiBrewUuid(apiBrewUuid);
    if (!reviews || reviews.length === 0) return null;

    let totalScore = 0;

    for (const review of reviews) {
      let reviewScore = 0;

      if (review.review_type === 'quick' && review.quick_review) {
        reviewScore = review.quick_review.overallRating;
      } else if (review.review_type === 'standard' && review.standard_review) {
        if (review.standard_review.calculatedScore !== undefined) {
          reviewScore = review.standard_review.calculatedScore;
        } else {
          const s = review.standard_review;
          reviewScore = (s.appearance + s.aroma + s.taste + s.mouthfeel) / 4;
        }
      } else if (review.review_type === 'expert' && review.expert_review) {
        if (review.expert_review.calculatedScore !== undefined) {
          reviewScore = review.expert_review.calculatedScore;
        } else {
          reviewScore = review.quick_review ? review.quick_review.overallRating : 0;
        }
      }

      totalScore += reviewScore;
    }

    const averageScore = Math.round((totalScore / reviews.length) * 100) / 100;
    return { averageScore, reviewCount: reviews.length };
  } catch (error) {
    console.error(`Error calculating average review score for brew ${apiBrewUuid}:`, error);
    return null;
  }
}
