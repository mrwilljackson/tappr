// Example review data for API documentation

export const quickReviewExample = {
  brewUuid: '550e8400-e29b-41d4-a716-446655440000',
  reviewerName: 'John Doe',
  isAnonymous: false,
  reviewType: 'quick',
  quickReview: {
    overallRating: 4,
    comments: 'Great IPA, would drink again!'
  }
};

export const standardReviewExample = {
  brewUuid: '550e8400-e29b-41d4-a716-446655440000',
  reviewerName: 'Jane Smith',
  isAnonymous: false,
  reviewType: 'standard',
  quickReview: {
    overallRating: 4,
    comments: 'Great IPA, would drink again!'
  },
  standardReview: {
    appearance: 4,
    aroma: 5,
    taste: 4,
    mouthfeel: 3,
    comments: 'Nice golden color, strong hop aroma, good balance of flavors'
  }
};

export const expertReviewExample = {
  brewUuid: '550e8400-e29b-41d4-a716-446655440000',
  reviewerId: '123e4567-e89b-12d3-a456-426614174000',
  isAnonymous: false,
  reviewType: 'expert',
  quickReview: {
    overallRating: 4,
    comments: 'Great IPA, would drink again!'
  },
  standardReview: {
    appearance: 4,
    aroma: 5,
    taste: 4,
    mouthfeel: 3,
    comments: 'Nice golden color, strong hop aroma, good balance of flavors'
  },
  expertReview: {
    appearance: {
      clarity: 4,
      color: 5,
      head: 4,
      notes: 'Golden amber with excellent head retention'
    },
    aroma: {
      intensity: 4,
      maltiness: 3,
      hoppiness: 5,
      fruitiness: 4,
      otherAromatics: 3,
      notes: 'Strong citrus and pine hop aroma with supporting malt backbone'
    },
    taste: {
      flavorIntensity: 4,
      maltCharacter: 3,
      hopCharacter: 5,
      bitterness: 4,
      sweetness: 2,
      balance: 4,
      notes: 'Bold hop flavor with enough malt to support, clean bitterness'
    },
    mouthfeel: {
      body: 3,
      carbonation: 4,
      warmth: 2,
      creaminess: 3,
      notes: 'Medium body with lively carbonation'
    },
    aftertaste: {
      duration: 4,
      pleasantness: 4,
      notes: 'Pleasant lingering hop bitterness'
    },
    styleAccuracy: 9
  }
};

export const reviewResponseExample = {
  message: 'Review added successfully',
  review: {
    id: 1,
    reviewId: '550e8400-e29b-41d4-a716-446655440002',
    brewUuid: '550e8400-e29b-41d4-a716-446655440000',
    reviewerName: 'John Doe',
    isAnonymous: false,
    reviewDate: '2023-11-15T14:30:00Z',
    reviewType: 'quick',
    quickReview: {
      overallRating: 4,
      comments: 'Great IPA, would drink again!'
    },
    createdAt: '2023-11-15T14:30:00Z',
    updatedAt: '2023-11-15T14:30:00Z'
  }
};
