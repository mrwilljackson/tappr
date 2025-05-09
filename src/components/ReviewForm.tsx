'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewType, QuickReview, StandardReview, ExpertReview } from '@/types/review';

interface ReviewFormProps {
  apiBrewUuid: string;
  brewUuid?: string; // For backward compatibility
  onSuccess?: (data: Record<string, unknown>) => void;
  onError?: (error: Error | unknown) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ apiBrewUuid, brewUuid, onSuccess, onError }) => {
  const router = useRouter();
  const [reviewType, setReviewType] = useState<ReviewType>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to calculate overall score from standard review values
  const calculateOverallScore = (review: StandardReview): number => {
    const totalScore =
      review.appearance +
      review.aroma +
      review.taste +
      review.mouthfeel;

    // Calculate to two decimal places (e.g., 3.75 instead of 4)
    return Math.round((totalScore / 4) * 100) / 100;
  };

  // Function to calculate overall score from expert review values
  const calculateExpertOverallScore = (review: ExpertReview): number => {
    // Sum all slider values except styleAccuracy
    const totalScore =
      // Appearance section (3 sliders)
      review.appearance.clarity +
      review.appearance.color +
      review.appearance.head +

      // Aroma section (5 sliders)
      review.aroma.intensity +
      review.aroma.maltiness +
      review.aroma.hoppiness +
      review.aroma.fruitiness +
      review.aroma.otherAromatics +

      // Taste section (6 sliders)
      review.taste.flavorIntensity +
      review.taste.maltCharacter +
      review.taste.hopCharacter +
      review.taste.bitterness +
      review.taste.sweetness +
      review.taste.balance +

      // Mouthfeel section (4 sliders)
      review.mouthfeel.body +
      review.mouthfeel.carbonation +
      review.mouthfeel.warmth +
      review.mouthfeel.creaminess +

      // Aftertaste section (2 sliders)
      review.aftertaste.duration +
      review.aftertaste.pleasantness;

    // Calculate to two decimal places (total divided by 20 sliders)
    return Math.round((totalScore / 20) * 100) / 100;
  };
  const [reviewerName, setReviewerName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Shared comments for all review types
  const [comments, setComments] = useState('');

  // Quick review state
  const [quickReview, setQuickReview] = useState<QuickReview>({
    overallRating: 0, // Start with no stars highlighted
    comments: '', // Will be populated from shared comments on submit
  });

  // Standard review state
  const [standardReview, setStandardReview] = useState<StandardReview>({
    appearance: 1,
    aroma: 1,
    taste: 1,
    mouthfeel: 1,
    comments: '', // Will be populated from shared comments on submit
  });

  // Expert review state (simplified for this example)
  const [expertReview, setExpertReview] = useState<ExpertReview>({
    appearance: {
      clarity: 1,
      color: 1,
      head: 1,
      notes: '',
    },
    aroma: {
      intensity: 1,
      maltiness: 1,
      hoppiness: 1,
      fruitiness: 1,
      otherAromatics: 1,
      notes: '',
    },
    taste: {
      flavorIntensity: 1,
      maltCharacter: 1,
      hopCharacter: 1,
      bitterness: 1,
      sweetness: 1,
      balance: 1,
      notes: '',
    },
    mouthfeel: {
      body: 1,
      carbonation: 1,
      warmth: 1,
      creaminess: 1,
      notes: '',
    },
    aftertaste: {
      duration: 1,
      pleasantness: 1,
      notes: '',
    },
    styleAccuracy: 1,
  });

  const handleQuickReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuickReview({
      ...quickReview,
      [name]: name === 'overallRating' ? parseInt(value) : value,
    });
  };

  const handleStandardReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update the standard review with the new value
    const updatedStandardReview = {
      ...standardReview,
      [name]: parseInt(value),
    };

    setStandardReview(updatedStandardReview);

    // Calculate the overall score for Quick Review based on Standard Review values
    const overallScore = calculateOverallScore(updatedStandardReview);

    // Update the quick review overall rating with the calculated score
    if (reviewType === 'standard') {
      setQuickReview({
        ...quickReview,
        overallRating: overallScore
      });
    }
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  // Calculate the overall score whenever standardReview changes or when review type changes to standard
  useEffect(() => {
    if (reviewType === 'standard') {
      const overallScore = calculateOverallScore(standardReview);
      setQuickReview(prev => ({
        ...prev,
        overallRating: overallScore
      }));
    }
  }, [standardReview, reviewType]);

  // Calculate the expert review score whenever expertReview changes or when review type changes to expert
  useEffect(() => {
    if (reviewType === 'expert') {
      const expertScore = calculateExpertOverallScore(expertReview);

      // Update the expertReview with the calculated score
      setExpertReview(prev => ({
        ...prev,
        calculatedScore: expertScore
      }));

      // Also update the quickReview overall rating for API compatibility
      setQuickReview(prev => ({
        ...prev,
        overallRating: expertScore
      }));
    }
  }, [
    expertReview.appearance,
    expertReview.aroma,
    expertReview.taste,
    expertReview.mouthfeel,
    expertReview.aftertaste,
    reviewType
  ]);

  // Simplified expert review change handler
  const handleExpertReviewChange = (section: keyof ExpertReview, field: string, value: string | number) => {
    setExpertReview({
      ...expertReview,
      [section]: {
        ...expertReview[section],
        [field]: typeof value === 'string' ? value : parseInt(value as string),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on review type
    if (reviewType === 'expert') {
      // For expert reviews, validate that at least one rating is provided
      // This is just a basic check - you might want to add more specific validation
      if (expertReview.styleAccuracy === 0) {
        setErrorMessage('Please provide at least a style accuracy rating');
        return;
      }

      // For expert reviews, we need to ensure we have a valid overall rating
      // Instead of just updating the state (which might not be reflected immediately),
      // we'll create a local copy with a valid rating to use in the submission
      if (quickReview.overallRating === 0) {
        // Force a default value of 1 for expert reviews
        quickReview.overallRating = 1;
      }
    } else {
      // For quick and standard reviews, validate the overall rating
      if (quickReview.overallRating === 0) {
        setErrorMessage('Please select an overall rating (1-5 stars)');
        return;
      }
    }

    // Comments are now optional, no validation needed

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Prepare the review data based on the selected type
      const reviewData: Record<string, unknown> = {
        api_brew_uuid: apiBrewUuid,
        brewUuid,  // Include for backward compatibility
        reviewType,
        isAnonymous,
      };

      // Add reviewer name if not anonymous
      if (!isAnonymous && reviewerName.trim()) {
        reviewData.reviewerName = reviewerName;
      }

      // Create a quickReview object with comments (required by API for all review types)
      // Make sure we have a valid overallRating (at least 1) for all review types
      // Ensure the overallRating is stored with one decimal place precision
      const quickReviewWithComments = {
        ...quickReview,
        // Ensure it's at least 1 and has two decimal places precision
        overallRating: quickReview.overallRating ?
          Math.round(quickReview.overallRating * 100) / 100 : 1.00,
        comments: comments
      };

      // Always include quickReview (required by API)
      reviewData.quickReview = quickReviewWithComments;

      // Handle different review types
      if (reviewType === 'expert') {
        // For expert reviews, add the expert review data and standard review data
        // Add comments and calculated score to the expert review
        const expertScore = calculateExpertOverallScore(expertReview);
        const expertReviewWithComments = {
          ...expertReview,
          calculatedScore: expertScore, // Add calculated score
          comments: comments // Add shared comments to expert review
        };

        // Expert reviews require both standardReview and expertReview data
        // Create a copy of standardReview with comments and ensure calculated values have one decimal place
        const standardReviewWithComments = {
          ...standardReview,
          // Store the calculated overall score in the standardReview object as well
          calculatedScore: Math.round((
            standardReview.appearance +
            standardReview.aroma +
            standardReview.taste +
            standardReview.mouthfeel
          ) / 4 * 100) / 100,
          comments: comments
        };

        reviewData.expertReview = expertReviewWithComments;
        reviewData.standardReview = standardReviewWithComments;
      } else if (reviewType === 'standard') {
        // For standard reviews, add the standard review data
        // Create a copy of standardReview with comments and ensure calculated values have one decimal place
        const standardReviewWithComments = {
          ...standardReview,
          // Store the calculated overall score in the standardReview object as well
          calculatedScore: Math.round((
            standardReview.appearance +
            standardReview.aroma +
            standardReview.taste +
            standardReview.mouthfeel
          ) / 4 * 100) / 100,
          comments: comments
        };
        reviewData.standardReview = standardReviewWithComments;
      }
      // For quick reviews, we already added the quickReview above

      // Submit the review
      const response = await fetch('/api/reviews/public/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Show temporary success message
      setSuccessMessage('Review submitted successfully! Redirecting...');

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data);
      }

      // Redirect to the confirmation page after a short delay
      setTimeout(() => {
        router.push(`/review-confirmation/${apiBrewUuid}`);
      }, 1000);
    } catch (error: Error | unknown) {
      console.error('Error submitting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit review';
      setErrorMessage(errorMessage);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 font-patua">Submit Your Review</h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
            Review Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <button
                type="button"
                className={`py-3 px-4 rounded-md font-montserrat text-center transition-colors ${
                  reviewType === 'quick'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setReviewType('quick')}
              >
                <span className="font-semibold">Quick</span>
              </button>
              <p className="text-xs text-gray-600 mt-1 text-center">
                Simple star rating and comments
              </p>
            </div>

            <div className="flex flex-col">
              <button
                type="button"
                className={`py-3 px-4 rounded-md font-montserrat text-center transition-colors ${
                  reviewType === 'standard'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setReviewType('standard')}
              >
                <span className="font-semibold">Standard</span>
              </button>
              <p className="text-xs text-gray-600 mt-1 text-center">
                Rate appearance, aroma, taste, and mouthfeel
              </p>
            </div>

            <div className="flex flex-col">
              <button
                type="button"
                className={`py-3 px-4 rounded-md font-montserrat text-center transition-colors ${
                  reviewType === 'expert'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setReviewType('expert')}
              >
                <span className="font-semibold">Expert</span>
              </button>
              <p className="text-xs text-gray-600 mt-1 text-center">
                Detailed analysis with multiple criteria
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
            Your Name (Optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            disabled={isAnonymous}
          />
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <span className="ml-2 font-montserrat">Submit anonymously</span>
            </label>
          </div>
        </div>

        {/* Quick Review Section - Visible for Quick and Standard reviews */}
        {reviewType !== 'expert' && (
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-3 font-patua">Overall Rating</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                Overall Rating (1-5) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="cursor-pointer">
                    <input
                      type="radio"
                      name="overallRating"
                      value={rating}
                      checked={quickReview.overallRating === rating}
                      onChange={handleQuickReviewChange}
                      className="sr-only"
                    />
                    <span
                      className={`text-3xl ${
                        quickReview.overallRating >= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}

                {/* Hidden radio for clearing selection */}
                <button
                  type="button"
                  className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setQuickReview({...quickReview, overallRating: 0})}
                  style={{display: quickReview.overallRating > 0 ? 'block' : 'none'}}
                >
                  Clear
                </button>

                {/* Display the numeric rating value with one decimal place */}
                {quickReview.overallRating > 0 && (
                  <span className="ml-3 font-semibold text-amber-600 text-xl">
                    {quickReview.overallRating.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Standard Review Section */}
        {reviewType === 'standard' && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold font-patua">Detailed Ratings</h3>
              <div className="text-right">
                <span className="text-sm text-gray-600">Calculated Overall Score: </span>
                <span className="font-bold text-amber-600">{quickReview.overallRating.toFixed(2)}/5</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                  Appearance (1-5)
                </label>
                <input
                  type="range"
                  name="appearance"
                  min="1"
                  max="5"
                  value={standardReview.appearance}
                  onChange={handleStandardReviewChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`px-2 py-1 rounded-full ${standardReview.appearance === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => {
                        // Create a synthetic event to reuse the existing handler
                        const syntheticEvent = {
                          target: { name: 'appearance', value: value.toString() }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleStandardReviewChange(syntheticEvent);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                  Aroma (1-5)
                </label>
                <input
                  type="range"
                  name="aroma"
                  min="1"
                  max="5"
                  value={standardReview.aroma}
                  onChange={handleStandardReviewChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`px-2 py-1 rounded-full ${standardReview.aroma === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => {
                        // Create a synthetic event to reuse the existing handler
                        const syntheticEvent = {
                          target: { name: 'aroma', value: value.toString() }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleStandardReviewChange(syntheticEvent);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                  Taste (1-5)
                </label>
                <input
                  type="range"
                  name="taste"
                  min="1"
                  max="5"
                  value={standardReview.taste}
                  onChange={handleStandardReviewChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`px-2 py-1 rounded-full ${standardReview.taste === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => {
                        // Create a synthetic event to reuse the existing handler
                        const syntheticEvent = {
                          target: { name: 'taste', value: value.toString() }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleStandardReviewChange(syntheticEvent);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                  Mouthfeel (1-5)
                </label>
                <input
                  type="range"
                  name="mouthfeel"
                  min="1"
                  max="5"
                  value={standardReview.mouthfeel}
                  onChange={handleStandardReviewChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`px-2 py-1 rounded-full ${standardReview.mouthfeel === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => {
                        // Create a synthetic event to reuse the existing handler
                        const syntheticEvent = {
                          target: { name: 'mouthfeel', value: value.toString() }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleStandardReviewChange(syntheticEvent);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Expert Review Section */}
        {reviewType === 'expert' && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold font-patua">Expert Analysis</h3>
              <div className="text-right">
                <span className="text-sm text-gray-600">Calculated Overall Score: </span>
                <span className="font-bold text-xl text-amber-600">
                  {expertReview.calculatedScore ? expertReview.calculatedScore.toFixed(2) : (calculateExpertOverallScore(expertReview).toFixed(2))}/5
                </span>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 font-patua">Appearance</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Clarity (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.appearance.clarity}
                    onChange={(e) => handleExpertReviewChange('appearance', 'clarity', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.appearance.clarity === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('appearance', 'clarity', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Color (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.appearance.color}
                    onChange={(e) => handleExpertReviewChange('appearance', 'color', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.appearance.color === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('appearance', 'color', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Head (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.appearance.head}
                    onChange={(e) => handleExpertReviewChange('appearance', 'head', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.appearance.head === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('appearance', 'head', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Aroma Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 font-patua">Aroma</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Intensity (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aroma.intensity}
                    onChange={(e) => handleExpertReviewChange('aroma', 'intensity', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aroma.intensity === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aroma', 'intensity', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Hoppiness (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aroma.hoppiness}
                    onChange={(e) => handleExpertReviewChange('aroma', 'hoppiness', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aroma.hoppiness === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aroma', 'hoppiness', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Maltiness (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aroma.maltiness}
                    onChange={(e) => handleExpertReviewChange('aroma', 'maltiness', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aroma.maltiness === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aroma', 'maltiness', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Fruitiness (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aroma.fruitiness}
                    onChange={(e) => handleExpertReviewChange('aroma', 'fruitiness', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aroma.fruitiness === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aroma', 'fruitiness', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Other Aromatics (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aroma.otherAromatics}
                    onChange={(e) => handleExpertReviewChange('aroma', 'otherAromatics', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aroma.otherAromatics === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aroma', 'otherAromatics', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Taste Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 font-patua">Taste</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Flavor Intensity (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.taste.flavorIntensity}
                    onChange={(e) => handleExpertReviewChange('taste', 'flavorIntensity', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.taste.flavorIntensity === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('taste', 'flavorIntensity', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Malt Character (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.taste.maltCharacter}
                    onChange={(e) => handleExpertReviewChange('taste', 'maltCharacter', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.taste.maltCharacter === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('taste', 'maltCharacter', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Hop Character (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.taste.hopCharacter}
                    onChange={(e) => handleExpertReviewChange('taste', 'hopCharacter', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.taste.hopCharacter === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('taste', 'hopCharacter', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Bitterness (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.taste.bitterness}
                    onChange={(e) => handleExpertReviewChange('taste', 'bitterness', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.taste.bitterness === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('taste', 'bitterness', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Sweetness (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.taste.sweetness}
                    onChange={(e) => handleExpertReviewChange('taste', 'sweetness', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.taste.sweetness === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('taste', 'sweetness', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Balance (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.taste.balance}
                    onChange={(e) => handleExpertReviewChange('taste', 'balance', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.taste.balance === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('taste', 'balance', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mouthfeel Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 font-patua">Mouthfeel</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Body (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.mouthfeel.body}
                    onChange={(e) => handleExpertReviewChange('mouthfeel', 'body', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.mouthfeel.body === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('mouthfeel', 'body', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Carbonation (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.mouthfeel.carbonation}
                    onChange={(e) => handleExpertReviewChange('mouthfeel', 'carbonation', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.mouthfeel.carbonation === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('mouthfeel', 'carbonation', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Warmth (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.mouthfeel.warmth}
                    onChange={(e) => handleExpertReviewChange('mouthfeel', 'warmth', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.mouthfeel.warmth === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('mouthfeel', 'warmth', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Creaminess (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.mouthfeel.creaminess}
                    onChange={(e) => handleExpertReviewChange('mouthfeel', 'creaminess', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.mouthfeel.creaminess === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('mouthfeel', 'creaminess', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Aftertaste Section */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 font-patua">Aftertaste</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Duration (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aftertaste.duration}
                    onChange={(e) => handleExpertReviewChange('aftertaste', 'duration', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aftertaste.duration === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aftertaste', 'duration', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat mb-1">Pleasantness (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.aftertaste.pleasantness}
                    onChange={(e) => handleExpertReviewChange('aftertaste', 'pleasantness', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`px-2 py-1 rounded-full ${expertReview.aftertaste.pleasantness === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => handleExpertReviewChange('aftertaste', 'pleasantness', value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Style Accuracy */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 font-patua">Style Accuracy</h4>
              <div>
                <label className="block text-gray-700 text-sm font-montserrat mb-1">
                  How well does this beer match its intended style? (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expertReview.styleAccuracy}
                  onChange={(e) => setExpertReview({...expertReview, styleAccuracy: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`px-1 py-1 rounded-full ${expertReview.styleAccuracy === value ? 'bg-amber-600 text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => setExpertReview({...expertReview, styleAccuracy: value})}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared Comments Section - Always visible at the bottom */}
        <div className="border-t pt-4 mt-6">
          <h3 className="text-xl font-semibold mb-3 font-patua">Your Comments</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
              Share your thoughts about this beer <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comments}
              onChange={handleCommentsChange}
              placeholder="What did you like or dislike about this beer? Would you recommend it to others? (Optional)"
            ></textarea>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-montserrat font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
