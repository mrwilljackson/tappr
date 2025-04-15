'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewType, QuickReview, StandardReview, ExpertReview } from '@/types/review';

interface ReviewFormProps {
  brewUuid: string;
  onSuccess?: (data: Record<string, unknown>) => void;
  onError?: (error: Error | unknown) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ brewUuid, onSuccess, onError }) => {
  const router = useRouter();
  const [reviewType, setReviewType] = useState<ReviewType>('quick');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Quick review state
  const [quickReview, setQuickReview] = useState<QuickReview>({
    overallRating: 3,
    comments: '',
  });

  // Standard review state
  const [standardReview, setStandardReview] = useState<StandardReview>({
    appearance: 3,
    aroma: 3,
    taste: 3,
    mouthfeel: 3,
    comments: '',
  });

  // Expert review state (simplified for this example)
  const [expertReview, setExpertReview] = useState<ExpertReview>({
    appearance: {
      clarity: 3,
      color: 3,
      head: 3,
      notes: '',
    },
    aroma: {
      intensity: 3,
      maltiness: 3,
      hoppiness: 3,
      fruitiness: 3,
      otherAromatics: 3,
      notes: '',
    },
    taste: {
      flavorIntensity: 3,
      maltCharacter: 3,
      hopCharacter: 3,
      bitterness: 3,
      sweetness: 3,
      balance: 3,
      notes: '',
    },
    mouthfeel: {
      body: 3,
      carbonation: 3,
      warmth: 3,
      creaminess: 3,
      notes: '',
    },
    aftertaste: {
      duration: 3,
      pleasantness: 3,
      notes: '',
    },
    styleAccuracy: 3,
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
    setStandardReview({
      ...standardReview,
      [name]: name === 'comments' ? value : parseInt(value),
    });
  };

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
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Prepare the review data based on the selected type
      const reviewData: Record<string, unknown> = {
        brewUuid,
        reviewType,
        quickReview,
        isAnonymous,
      };

      // Add reviewer name if not anonymous
      if (!isAnonymous && reviewerName.trim()) {
        reviewData.reviewerName = reviewerName;
      }

      // Add standard review if applicable
      if (reviewType === 'standard' || reviewType === 'expert') {
        reviewData.standardReview = standardReview;
      }

      // Add expert review if applicable
      if (reviewType === 'expert') {
        reviewData.expertReview = expertReview;
      }

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
        router.push(`/review-confirmation/${brewUuid}`);
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
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="reviewType"
                value="quick"
                checked={reviewType === 'quick'}
                onChange={() => setReviewType('quick')}
              />
              <span className="ml-2 font-montserrat">Quick Review</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="reviewType"
                value="standard"
                checked={reviewType === 'standard'}
                onChange={() => setReviewType('standard')}
              />
              <span className="ml-2 font-montserrat">Standard Review</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="reviewType"
                value="expert"
                checked={reviewType === 'expert'}
                onChange={() => setReviewType('expert')}
              />
              <span className="ml-2 font-montserrat">Expert Review</span>
            </label>
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

        {/* Quick Review Section - Always visible */}
        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-3 font-patua">Quick Review</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
              Overall Rating (1-5)
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
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
              Comments
            </label>
            <textarea
              name="comments"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quickReview.comments}
              onChange={handleQuickReviewChange}
              required
            ></textarea>
          </div>
        </div>

        {/* Standard Review Section */}
        {(reviewType === 'standard' || reviewType === 'expert') && (
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-3 font-patua">Standard Review</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
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
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
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
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
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
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                Detailed Comments
              </label>
              <textarea
                name="comments"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={standardReview.comments}
                onChange={handleStandardReviewChange}
                required={reviewType === 'standard' || reviewType === 'expert'}
              ></textarea>
            </div>
          </div>
        )}

        {/* Expert Review Section - Simplified for this example */}
        {reviewType === 'expert' && (
          <div className="border-t pt-4">
            <h3 className="text-xl font-semibold mb-3 font-patua">Expert Review</h3>

            {/* Appearance Section */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 font-patua">Appearance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat">Clarity (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.appearance.clarity}
                    onChange={(e) => handleExpertReviewChange('appearance', 'clarity', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat">Color (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.appearance.color}
                    onChange={(e) => handleExpertReviewChange('appearance', 'color', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-montserrat">Head (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={expertReview.appearance.head}
                    onChange={(e) => handleExpertReviewChange('appearance', 'head', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-gray-700 text-sm font-montserrat">Notes</label>
                <textarea
                  value={expertReview.appearance.notes}
                  onChange={(e) => handleExpertReviewChange('appearance', 'notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                ></textarea>
              </div>
            </div>

            {/* Style Accuracy */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2 font-montserrat">
                Style Accuracy (1-10)
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
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>

            {/* Note: For brevity, we're not including all expert review fields in this example */}
            <p className="text-gray-500 italic mt-2 font-montserrat">
              Note: Some expert review fields are simplified in this form.
            </p>
          </div>
        )}

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
