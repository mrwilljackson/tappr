# Review Model

> **NOTE**: This documentation has been migrated to Confluence on 17-04-2024. Please refer to the [TAPPr API Documentation](https://mrwilljackson-projects.atlassian.net/wiki/spaces/API) for the most up-to-date information.

The Review model represents a review of a beer in the TAPPR system.

## Properties

| Property       | Type    | Description                                      | Required |
|----------------|---------|--------------------------------------------------|----------|
| id             | integer | Unique identifier for the review                 | Yes (auto-generated) |
| review_id      | string  | UUID for the review                              | Yes (auto-generated) |
| api_brew_uuid  | string  | UUID of the brew being reviewed (API-generated)  | Yes      |
| brew_uuid      | string  | UUID of the brew in the companion app            | No       |
| reviewer_id    | string  | ID of the reviewer (if authenticated)            | No       |
| reviewer_name  | string  | Name of the reviewer                             | No       |
| is_anonymous   | boolean | Whether the review is anonymous                  | Yes (defaults to false) |
| review_date    | string  | Date of the review (ISO 8601 format)             | Yes (auto-generated) |
| review_type    | string  | Type of review: "quick", "standard", or "expert" | Yes      |
| quick_review   | object  | Quick review data                                | Yes      |
| standard_review| object  | Standard review data                             | No (required for "standard" and "expert" types) |
| expert_review  | object  | Expert review data                               | No (required for "expert" type) |
| created_at     | string  | Timestamp when the review was created (ISO 8601) | Yes (auto-generated) |
| updated_at     | string  | Timestamp when the review was last updated (ISO 8601) | Yes (auto-generated) |

## Review Types

### Quick Review

A basic review with an overall rating and comments.

| Property      | Type    | Description                                      | Required |
|---------------|---------|--------------------------------------------------|----------|
| overallRating | integer | Overall rating (1-5)                             | Yes      |
| comments      | string  | Comments about the beer                          | Yes      |

### Standard Review

A more detailed review with ratings for different aspects of the beer.

| Property    | Type    | Description                                      | Required |
|-------------|---------|--------------------------------------------------|----------|
| appearance  | integer | Rating for appearance (1-5)                      | Yes      |
| aroma       | integer | Rating for aroma (1-5)                           | Yes      |
| taste       | integer | Rating for taste (1-5)                           | Yes      |
| mouthfeel   | integer | Rating for mouthfeel (1-5)                       | Yes      |
| comments    | string  | Detailed comments about the beer                 | Yes      |

### Expert Review

A comprehensive review with detailed ratings for various aspects of the beer.

| Property       | Type   | Description                                      | Required |
|----------------|--------|--------------------------------------------------|----------|
| appearance     | object | Detailed appearance ratings                      | Yes      |
| aroma          | object | Detailed aroma ratings                           | Yes      |
| taste          | object | Detailed taste ratings                           | Yes      |
| mouthfeel      | object | Detailed mouthfeel ratings                       | Yes      |
| aftertaste     | object | Detailed aftertaste ratings                      | Yes      |
| styleAccuracy  | integer| Rating for how well the beer matches its style (1-10) | Yes |

#### Appearance

| Property | Type    | Description                                      | Required |
|----------|---------|--------------------------------------------------|----------|
| clarity  | integer | Rating for clarity (1-5)                         | Yes      |
| color    | integer | Rating for color (1-5)                           | Yes      |
| head     | integer | Rating for head (1-5)                            | Yes      |
| notes    | string  | Notes about the appearance                       | Yes      |

#### Aroma

| Property       | Type    | Description                                      | Required |
|----------------|---------|--------------------------------------------------|----------|
| intensity      | integer | Rating for aroma intensity (1-5)                 | Yes      |
| maltiness      | integer | Rating for maltiness (1-5)                       | Yes      |
| hoppiness      | integer | Rating for hoppiness (1-5)                       | Yes      |
| fruitiness     | integer | Rating for fruitiness (1-5)                      | Yes      |
| otherAromatics | integer | Rating for other aromatics (1-5)                 | Yes      |
| notes          | string  | Notes about the aroma                            | Yes      |

#### Taste

| Property       | Type    | Description                                      | Required |
|----------------|---------|--------------------------------------------------|----------|
| flavorIntensity| integer | Rating for flavor intensity (1-5)                | Yes      |
| maltCharacter  | integer | Rating for malt character (1-5)                  | Yes      |
| hopCharacter   | integer | Rating for hop character (1-5)                   | Yes      |
| bitterness     | integer | Rating for bitterness (1-5)                      | Yes      |
| sweetness      | integer | Rating for sweetness (1-5)                       | Yes      |
| balance        | integer | Rating for balance (1-5)                         | Yes      |
| notes          | string  | Notes about the taste                            | Yes      |

#### Mouthfeel

| Property    | Type    | Description                                      | Required |
|-------------|---------|--------------------------------------------------|----------|
| body        | integer | Rating for body (1-5)                            | Yes      |
| carbonation | integer | Rating for carbonation (1-5)                     | Yes      |
| warmth      | integer | Rating for warmth (1-5)                          | Yes      |
| creaminess  | integer | Rating for creaminess (1-5)                      | Yes      |
| notes       | string  | Notes about the mouthfeel                        | Yes      |

#### Aftertaste

| Property     | Type    | Description                                      | Required |
|--------------|---------|--------------------------------------------------|----------|
| duration     | integer | Rating for duration (1-5)                        | Yes      |
| pleasantness | integer | Rating for pleasantness (1-5)                    | Yes      |
| notes        | string  | Notes about the aftertaste                       | Yes      |

## Example

### Quick Review

```json
{
  "id": 1,
  "review_id": "550e8400-e29b-41d4-a716-446655440002",
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "reviewer_name": "John Doe",
  "is_anonymous": false,
  "review_date": "2023-11-15T14:30:00Z",
  "review_type": "quick",
  "quick_review": {
    "overallRating": 4,
    "comments": "Great IPA, would drink again!"
  },
  "created_at": "2023-11-15T14:30:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

### Standard Review

```json
{
  "id": 2,
  "review_id": "9d7f25e7-7b3c-4d1a-b6e8-f8a9b5c7d6e5",
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "reviewer_name": "Jane Smith",
  "is_anonymous": false,
  "review_date": "2023-11-16T10:15:00Z",
  "review_type": "standard",
  "quick_review": {
    "overallRating": 4,
    "comments": "Great IPA, would drink again!"
  },
  "standard_review": {
    "appearance": 4,
    "aroma": 5,
    "taste": 4,
    "mouthfeel": 3,
    "comments": "Nice golden color, strong hop aroma, good balance of flavors"
  },
  "created_at": "2023-11-16T10:15:00Z",
  "updated_at": "2023-11-16T10:15:00Z"
}
```

## Input Model for Creating a Review

When creating a new review, you can provide the following properties:

| Property       | Type    | Description                                      | Required |
|----------------|---------|--------------------------------------------------|----------|
| api_brew_uuid  | string  | UUID of the brew being reviewed (API-generated)  | Yes      |
| brewUuid       | string  | UUID of the brew in the companion app            | No       |
| reviewerId     | string  | ID of the reviewer (if authenticated)            | No       |
| reviewerName   | string  | Name of the reviewer                             | No       |
| isAnonymous    | boolean | Whether the review is anonymous                  | No (defaults to false) |
| reviewType     | string  | Type of review: "quick", "standard", or "expert" | Yes      |
| quickReview    | object  | Quick review data                                | Yes      |
| standardReview | object  | Standard review data                             | No (required for "standard" and "expert" types) |
| expertReview   | object  | Expert review data                               | No (required for "expert" type) |

## Example Input

### Quick Review

```json
{
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brewUuid": "550e8400-e29b-41d4-a716-446655440000",
  "reviewerName": "John Doe",
  "isAnonymous": false,
  "reviewType": "quick",
  "quickReview": {
    "overallRating": 4,
    "comments": "Great IPA, would drink again!"
  }
}
```

### Standard Review

```json
{
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brewUuid": "550e8400-e29b-41d4-a716-446655440000",
  "reviewerName": "Jane Smith",
  "isAnonymous": false,
  "reviewType": "standard",
  "quickReview": {
    "overallRating": 4,
    "comments": "Great IPA, would drink again!"
  },
  "standardReview": {
    "appearance": 4,
    "aroma": 5,
    "taste": 4,
    "mouthfeel": 3,
    "comments": "Nice golden color, strong hop aroma, good balance of flavors"
  }
}
```

## Notes

- The `id`, `review_id`, `created_at`, and `updated_at` properties are auto-generated and cannot be set manually.
- The `review_date` property is auto-generated with the current date and time if not provided.
- The `reviewType` property must be one of: "quick", "standard", or "expert".
- For "standard" reviews, both `quickReview` and `standardReview` are required.
- For "expert" reviews, `quickReview`, `standardReview`, and `expertReview` are all required.

## Database Mapping

The Review model maps to the `reviews` table in the database. The API uses camelCase property names, while the database uses snake_case column names:

| API Property | Database Column |
|--------------|------------------|
| id | id |
| reviewId | review_id |
| api_brew_uuid | api_brew_uuid |
| brewUuid | brew_uuid |
| reviewerId | reviewer_id |
| reviewerName | reviewer_name |
| isAnonymous | is_anonymous |
| reviewDate | review_date |
| reviewType | review_type |
| quickReview | quick_review |
| standardReview | standard_review |
| expertReview | expert_review |
| createdAt | created_at |
| updatedAt | updated_at |

### JSON Storage

The review data objects (`quickReview`, `standardReview`, and `expertReview`) are stored as JSON in the database using PostgreSQL's `jsonb` type. This allows for efficient storage and querying of the nested review data.
