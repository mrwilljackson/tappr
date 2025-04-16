// Review types for the TAPPR API

// Quick Review (always required)
export interface QuickReview {
  overallRating: number; // Scale 1-5
  comments: string;
}

// Standard Review (optional)
export interface StandardReview {
  appearance: number; // Scale 1-5
  aroma: number; // Scale 1-5
  taste: number; // Scale 1-5
  mouthfeel: number; // Scale 1-5
  comments: string;
}

// Expert Review - Appearance section
export interface ExpertAppearance {
  clarity: number;
  color: number;
  head: number;
  notes: string;
}

// Expert Review - Aroma section
export interface ExpertAroma {
  intensity: number;
  maltiness: number;
  hoppiness: number;
  fruitiness: number;
  otherAromatics: number;
  notes: string;
}

// Expert Review - Taste section
export interface ExpertTaste {
  flavorIntensity: number;
  maltCharacter: number;
  hopCharacter: number;
  bitterness: number;
  sweetness: number;
  balance: number;
  notes: string;
}

// Expert Review - Mouthfeel section
export interface ExpertMouthfeel {
  body: number;
  carbonation: number;
  warmth: number;
  creaminess: number;
  notes: string;
}

// Expert Review - Aftertaste section
export interface ExpertAftertaste {
  duration: number;
  pleasantness: number;
  notes: string;
}

// Expert Review (optional)
export interface ExpertReview {
  appearance: ExpertAppearance;
  aroma: ExpertAroma;
  taste: ExpertTaste;
  mouthfeel: ExpertMouthfeel;
  aftertaste: ExpertAftertaste;
  styleAccuracy: number;
}

// Review type enum
export type ReviewType = 'quick' | 'standard' | 'expert';

// Complete Review interface
export interface Review {
  reviewId: string;
  apiBrewUuid: string;  // Primary reference to the brew in the API database
  brewUuid?: string;    // Optional reference to the brew in the companion app

  // Reviewer identification (optional)
  reviewerId?: string;
  reviewerName?: string;
  isAnonymous: boolean;

  reviewDate: string;
  reviewType: ReviewType;

  // Review sections
  quickReview: QuickReview;
  standardReview?: StandardReview;
  expertReview?: ExpertReview;
}

// Input for creating a new review
export interface ReviewCreateInput {
  apiBrewUuid: string;  // Primary reference to the brew in the API database
  brewUuid?: string;    // Optional reference to the brew in the companion app

  // Reviewer identification (optional)
  reviewerId?: string;
  reviewerName?: string;
  isAnonymous?: boolean;

  reviewType: ReviewType;

  // Review sections
  quickReview: QuickReview;
  standardReview?: StandardReview;
  expertReview?: ExpertReview;
}
