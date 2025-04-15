# Review Endpoints

## Get All Reviews

Retrieves a list of all reviews.

**URL**: `/reviews`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "id": 1,
    "review_id": "550e8400-e29b-41d4-a716-446655440002",
    "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
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
  },
  // More reviews...
]
```

**Error Response**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

## Get Review by ID

Retrieves a specific review by its ID.

**URL**: `/reviews/{id}`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `id`: The ID of the review to retrieve

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": 1,
  "review_id": "550e8400-e29b-41d4-a716-446655440002",
  "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
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

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Review not found"
}
```

## Get Reviews by Brew UUID

Retrieves all reviews for a specific brew.

**URL**: `/reviews/brew/{brewUuid}`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `brewUuid`: The UUID of the brew to get reviews for

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "id": 1,
    "review_id": "550e8400-e29b-41d4-a716-446655440002",
    "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
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
  },
  // More reviews for this brew...
]
```

**Error Response**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

## Add Review

Adds a new review.

**URL**: `/reviews/add`

**Method**: `POST`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**Request Body**:
```json
{
  "brewUuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "reviewerName": "John Doe",
  "isAnonymous": false,
  "reviewType": "quick",
  "quickReview": {
    "overallRating": 4,
    "comments": "Great IPA, would drink again!"
  }
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "Review added successfully",
  "review": {
    "id": 1,
    "review_id": "550e8400-e29b-41d4-a716-446655440002",
    "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
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
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Missing required fields: brewUuid, reviewType, and quickReview are required"
}
```

- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Beer not found"
}
```

## Add Public Review

Adds a new review without requiring authentication. This endpoint is public.

**URL**: `/reviews/public/add`

**Method**: `POST`

**Authentication Required**: No

**Headers**:
- `Content-Type`: application/json

**Request Body**:
```json
{
  "brewUuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "reviewerName": "John Doe",
  "isAnonymous": false,
  "reviewType": "quick",
  "quickReview": {
    "overallRating": 4,
    "comments": "Great IPA, would drink again!"
  }
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "Review added successfully",
  "review": {
    "id": 1,
    "review_id": "550e8400-e29b-41d4-a716-446655440002",
    "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
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
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Missing required fields: brewUuid, reviewType, and quickReview are required"
}
```

- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Beer not found"
}
```

## Update Review

Updates an existing review.

**URL**: `/reviews/{id}/update`

**Method**: `PATCH`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**URL Parameters**:
- `id`: The ID of the review to update

**Request Body**:
```json
{
  "reviewerName": "Updated Name",
  "quickReview": {
    "overallRating": 5,
    "comments": "Updated comments after trying it again!"
  }
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Review updated successfully",
  "review": {
    "id": 1,
    "review_id": "550e8400-e29b-41d4-a716-446655440002",
    "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "reviewer_name": "Updated Name",
    "is_anonymous": false,
    "review_date": "2023-11-15T14:30:00Z",
    "review_type": "quick",
    "quick_review": {
      "overallRating": 5,
      "comments": "Updated comments after trying it again!"
    },
    "created_at": "2023-11-15T14:30:00Z",
    "updated_at": "2024-04-15T14:30:00Z"
  }
}
```

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Review not found"
}
```

## Delete Review

Deletes a review from the system.

**URL**: `/reviews/{id}/delete`

**Method**: `DELETE`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `id`: The ID of the review to delete

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Review not found"
}
```

## Database Mapping

The review endpoints interact with the `reviews` table in the Supabase database. The API handles the conversion between camelCase (used in the API) and snake_case (used in the database) property names.

### Property Mapping

| API Property | Database Column |
|--------------|------------------|
| id | id |
| reviewId | review_id |
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

### Foreign Key Relationship

The `brewUuid` field in the reviews table references the `brew_uuid` field in the beers table, establishing a relationship between reviews and the beers they are for.
