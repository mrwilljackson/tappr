import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';
import { validateApiKey } from '@/lib/auth';

interface RouteContext {
  params: {
    recipeId: string;
  };
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // Validate API key
    const apiKeyValidation = validateApiKey(request);
    if (!apiKeyValidation.valid) {
      return NextResponse.json(
        { error: apiKeyValidation.error },
        { status: 401 }
      );
    }

    // Await params to ensure it's fully resolved
    const params = await context.params;
    const { recipeId } = params;

    // First, get all brews associated with the recipe
    const { data: brews, error: brewsError } = await supabase
      .from('brews')
      .select('*')
      .eq('recipe_id', recipeId);

    if (brewsError) {
      console.error(`Error fetching brews for recipe ${recipeId}:`, brewsError);
      return NextResponse.json(
        { error: 'Failed to fetch brews for recipe' },
        { status: 500 }
      );
    }

    if (!brews || brews.length === 0) {
      return NextResponse.json([]);
    }

    // Get the API brew UUIDs for all brews
    const apiBrewUuids = brews.map(brew => brew.api_brew_uuid);

    // Get all reviews for these brews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .in('api_brew_uuid', apiBrewUuids);

    if (reviewsError) {
      console.error(`Error fetching reviews for recipe ${recipeId}:`, reviewsError);
      return NextResponse.json(
        { error: 'Failed to fetch reviews for recipe' },
        { status: 500 }
      );
    }

    // Transform the reviews to include brew information
    const transformedReviews = reviews.map(review => {
      const brew = brews.find(b => b.api_brew_uuid === review.api_brew_uuid);
      return {
        reviewId: review.id,
        reviewerName: review.reviewer_name,
        isAnonymous: review.is_anonymous,
        reviewType: review.review_type,
        quickReview: review.quick_review,
        standardReview: review.standard_review,
        expertReview: review.expert_review,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
        brewInfo: {
          id: brew.id,
          name: brew.name,
          style: brew.style,
          apiBrewUuid: brew.api_brew_uuid,
          brewUuid: brew.brew_uuid
        }
      };
    });

    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error(`Error fetching reviews for recipe:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews for recipe' },
      { status: 500 }
    );
  }
}
