# Beer Review Feature Documentation

## Overview

The TAPPr beer review system allows users to submit reviews for beers in three different formats: Quick, Standard, and Expert. Each format provides a different level of detail and complexity, catering to different user preferences and expertise levels.

## Review Types

### Quick Review
- Simple star rating (1-5) with optional comments
- Ideal for casual users who want to quickly rate a beer

### Standard Review
- Includes ratings for appearance, aroma, taste, and mouthfeel
- Automatically calculates an overall score based on these ratings
- Provides a more detailed assessment than the Quick Review

### Expert Review
- Comprehensive evaluation with 20 different criteria across 5 categories:
  - Appearance (clarity, color, head)
  - Aroma (intensity, maltiness, hoppiness, fruitiness, otherAromatics)
  - Taste (flavorIntensity, maltCharacter, hopCharacter, bitterness, sweetness, balance)
  - Mouthfeel (body, carbonation, warmth, creaminess)
  - Aftertaste (duration, pleasantness)
- Also includes a separate "Style Accuracy" rating (1-10)
- Automatically calculates an overall score based on these ratings

## Score Calculation

### Quick Review
- User directly sets the overall rating (1-5)
- Displayed with two decimal places (e.g., 4.00)

### Standard Review
- Overall score is calculated by averaging the four category ratings:
  - `(appearance + aroma + taste + mouthfeel) / 4`
- Displayed and stored with two decimal places
- Updates in real-time as the user adjusts individual ratings

### Expert Review
- Overall score is calculated by averaging all 20 criteria (excluding Style Accuracy):
  - Sum of all ratings / 20
- Displayed and stored with two decimal places
- Updates in real-time as the user adjusts individual ratings

## User Interface Features

### General UI
- Default review type is Standard
- Comments field is consolidated at the bottom of the form and is optional
- Review type selection uses button selectors with descriptive text
- Section headers are descriptive and help users understand the purpose of each section

### Rating UI
- Star rating for Quick Review with numeric display showing the value with two decimal places
- Vertical layout for sliders in Standard and Expert reviews
- Each slider takes up the full width of the container for better usability
- Default slider values are set to 1
- Tappable numbers below each slider for easier selection
- Visual feedback (highlighting) shows the currently selected value
- Calculated scores are displayed prominently with two decimal places

### Form Flow
1. Select review type (defaults to Standard)
2. Enter reviewer information
3. Provide ratings based on selected review type
4. Enter comments at the end (optional)
5. Submit review

## API Integration

### Data Structure
- All review types require a `quickReview` object with an `overallRating` field
- Standard reviews include a `standardReview` object with individual ratings and a `calculatedScore`
- Expert reviews include an `expertReview` object with detailed ratings and a `calculatedScore`

### Submission Logic
- For Quick reviews, the user-provided rating is sent directly
- For Standard reviews, both individual ratings and the calculated overall score are sent
- For Expert reviews, all individual ratings and the calculated overall score are sent
- All scores are stored with two decimal places precision

### Average Review Score
- The API provides an endpoint to retrieve the average review score for a specific brew
- The average is calculated across all review types (Quick, Standard, Expert)
- For Quick reviews, the `overallRating` is used
- For Standard reviews, the calculated average of all rating fields is used
- For Expert reviews, the calculated average of all rating fields is used
- The response includes:
  - The API brew UUID
  - The average score (with two decimal places)
  - The total number of reviews

## Implementation Details

### State Management
- React state hooks manage the form state
- `useEffect` hooks recalculate scores when ratings change
- Validation ensures required fields are present before submission

### Score Calculation Functions
```javascript
// Standard Review score calculation
const calculateOverallScore = (review: StandardReview): number => {
  const totalScore =
    review.appearance +
    review.aroma +
    review.taste +
    review.mouthfeel;

  return Math.round((totalScore / 4) * 100) / 100;
};

// Expert Review score calculation
const calculateExpertOverallScore = (review: ExpertReview): number => {
  const totalScore =
    // Sum of all 20 criteria (excluding styleAccuracy)
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

  return Math.round((totalScore / 20) * 100) / 100;
};
```

## Future Enhancements

Potential improvements to consider:
- Add beer style guidelines for reference when rating Style Accuracy
- Implement user profiles to track review history
- Add social sharing features for reviews
- Implement a review moderation system
- Add the ability to upload photos with reviews
