# Recipe Endpoints

## Get All Recipes

Retrieves a list of all recipes.

**URL**: `/recipes`

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
    "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "name": "Helles Lager",
    "normalizedName": "helles lager",
    "author": "Jamil Zainasheff",
    "normalizedAuthor": "jamil zainasheff",
    "platform": "grainfather",
    "description": "A classic German lager with a clean, malty profile",
    "style": "German Helles",
    "createdAt": "2024-04-15T14:30:00Z",
    "updatedAt": "2024-04-15T14:30:00Z"
  },
  // More recipes...
]
```

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 500 Internal Server Error
- **Content**:
```json
{
  "error": "Failed to fetch recipes"
}
```

## Get Recipe by ID

Retrieves a specific recipe by its ID.

**URL**: `/recipes/{id}`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `id`: The ID of the recipe to retrieve

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": 1,
  "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "name": "Helles Lager",
  "normalizedName": "helles lager",
  "author": "Jamil Zainasheff",
  "normalizedAuthor": "jamil zainasheff",
  "platform": "grainfather",
  "description": "A classic German lager with a clean, malty profile",
  "style": "German Helles",
  "createdAt": "2024-04-15T14:30:00Z",
  "updatedAt": "2024-04-15T14:30:00Z"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Invalid ID format"
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
  "error": "Recipe not found"
}
```

## Get Recipe by Recipe ID

Retrieves a specific recipe by its deterministic UUID (recipe_id).

**URL**: `/recipes/recipe-id/{recipeId}`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `recipeId`: The deterministic UUID of the recipe to retrieve

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": 1,
  "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "name": "Helles Lager",
  "normalizedName": "helles lager",
  "author": "Jamil Zainasheff",
  "normalizedAuthor": "jamil zainasheff",
  "platform": "grainfather",
  "description": "A classic German lager with a clean, malty profile",
  "style": "German Helles",
  "createdAt": "2024-04-15T14:30:00Z",
  "updatedAt": "2024-04-15T14:30:00Z"
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
  "error": "Recipe not found"
}
```

## Search Recipes

Searches for recipes based on name, author, platform, or style.

**URL**: `/recipes/search?name={name}&author={author}&platform={platform}&style={style}`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**Query Parameters**:
- `name` (optional): Recipe name to search for
- `author` (optional): Author name to search for
- `platform` (optional): Platform to filter by
- `style` (optional): Style to filter by

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "id": 1,
    "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "name": "Helles Lager",
    "normalizedName": "helles lager",
    "author": "Jamil Zainasheff",
    "normalizedAuthor": "jamil zainasheff",
    "platform": "grainfather",
    "description": "A classic German lager with a clean, malty profile",
    "style": "German Helles",
    "createdAt": "2024-04-15T14:30:00Z",
    "updatedAt": "2024-04-15T14:30:00Z"
  },
  // More recipes...
]
```

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 500 Internal Server Error
- **Content**:
```json
{
  "error": "Failed to search recipes"
}
```

## Add New Recipe

Adds a new recipe to the system.

**URL**: `/recipes/add`

**Method**: `POST`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**Query Parameters**:
- `findOrCreate` (optional): If set to "true", will find an existing recipe with the same platform, author, and name, or create a new one if it doesn't exist

**Request Body**:
```json
{
  "name": "Helles Lager",
  "author": "Jamil Zainasheff",
  "platform": "grainfather",
  "description": "A classic German lager with a clean, malty profile",
  "style": "German Helles"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Recipe added successfully",
  "recipe": {
    "id": 1,
    "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "name": "Helles Lager",
    "normalizedName": "helles lager",
    "author": "Jamil Zainasheff",
    "normalizedAuthor": "jamil zainasheff",
    "platform": "grainfather",
    "description": "A classic German lager with a clean, malty profile",
    "style": "German Helles",
    "createdAt": "2024-04-15T14:30:00Z",
    "updatedAt": "2024-04-15T14:30:00Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Missing required fields: name, author, and platform are required"
}
```

- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 500 Internal Server Error
- **Content**:
```json
{
  "error": "Failed to add recipe"
}
```

## Update Recipe

Updates an existing recipe.

**URL**: `/recipes/{id}/update`

**Method**: `PATCH`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**URL Parameters**:
- `id`: The ID of the recipe to update

**Request Body**:
```json
{
  "name": "Updated Helles Lager",
  "description": "An updated description for the recipe",
  "style": "Updated German Helles"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Recipe updated successfully",
  "recipe": {
    "id": 1,
    "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "name": "Updated Helles Lager",
    "normalizedName": "updated helles lager",
    "author": "Jamil Zainasheff",
    "normalizedAuthor": "jamil zainasheff",
    "platform": "grainfather",
    "description": "An updated description for the recipe",
    "style": "Updated German Helles",
    "createdAt": "2024-04-15T14:30:00Z",
    "updatedAt": "2024-04-15T15:00:00Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Invalid ID format"
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
  "error": "Recipe not found"
}
```

## Delete Recipe

Deletes a recipe.

**URL**: `/recipes/{id}/delete`

**Method**: `DELETE`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `id`: The ID of the recipe to delete

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Recipe deleted successfully"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Invalid ID format"
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
  "error": "Recipe not found"
}
```

## Get Brews by Recipe ID

Retrieves all brews associated with a specific recipe.

**URL**: `/recipes/recipe-id/{recipeId}/brews`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `recipeId`: The deterministic UUID of the recipe

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "id": 1,
    "name": "Hoppy IPA",
    "style": "India Pale Ale",
    "abv": 6.5,
    "ibu": 65.5,
    "description": "A hoppy IPA with citrus and pine notes",
    "brewDate": "2023-10-15",
    "kegLevel": 85,
    "apiBrewUuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "brewUuid": "550e8400-e29b-41d4-a716-446655440000",
    "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "createdAt": "2023-11-15T14:30:00Z",
    "updatedAt": "2023-11-15T14:30:00Z"
  },
  // More brews...
]
```

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 500 Internal Server Error
- **Content**:
```json
{
  "error": "Failed to fetch brews"
}
```

## Get Reviews by Recipe ID

Retrieves all reviews for a specific recipe, including brew information for each review. This endpoint uses the `api_brew_uuid` field to establish the relationship between brews and reviews.

**URL**: `/recipes/recipe-id/{recipeId}/reviews`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `recipeId`: The deterministic UUID of the recipe

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "reviewId": 1,
    "reviewerName": "John Doe",
    "isAnonymous": false,
    "reviewType": "quick",
    "quickReview": {
      "overallRating": 4,
      "comments": "Great Helles Lager, would drink again!"
    },
    "standardReview": null,
    "expertReview": null,
    "createdAt": "2024-04-15T14:30:00Z",
    "updatedAt": "2024-04-15T14:30:00Z",
    "brewInfo": {
      "id": 1,
      "name": "My Helles Lager",
      "style": "German Helles",
      "apiBrewUuid": "8c0e80a3-b832-4a6d-894a-b8c07abffa49",
      "brewUuid": "dd2cba04-889d-4274-8288-0cec57020d29"
    }
  },
  {
    "reviewId": 2,
    "reviewerName": "Jane Smith",
    "isAnonymous": false,
    "reviewType": "standard",
    "quickReview": {
      "overallRating": 4,
      "comments": "Great Helles Lager, would drink again!"
    },
    "standardReview": {
      "appearance": 4,
      "aroma": 5,
      "taste": 4,
      "mouthfeel": 3,
      "comments": "Nice golden color, strong malt aroma, good balance of flavors"
    },
    "expertReview": null,
    "createdAt": "2024-04-15T15:00:00Z",
    "updatedAt": "2024-04-15T15:00:00Z",
    "brewInfo": {
      "id": 1,
      "name": "My Helles Lager",
      "style": "German Helles",
      "apiBrewUuid": "8c0e80a3-b832-4a6d-894a-b8c07abffa49",
      "brewUuid": "dd2cba04-889d-4274-8288-0cec57020d29"
    }
  },
  // More reviews...
]
```

**Error Responses**:
- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

- **Code**: 500 Internal Server Error
- **Content**:
```json
{
  "error": "Failed to fetch reviews for recipe"
}
```

## Link Brew to Recipe

Links a brew to a recipe using the API brew UUID.

**URL**: `/brews/api/{apiBrewUuid}/link-recipe`

**Method**: `POST`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**URL Parameters**:
- `apiBrewUuid`: The API UUID of the brew to link

**Request Body**:
```json
{
  "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Brew linked to recipe successfully",
  "brew": {
    "id": 1,
    "name": "Hoppy IPA",
    "style": "India Pale Ale",
    "abv": 6.5,
    "ibu": 65.5,
    "description": "A hoppy IPA with citrus and pine notes",
    "brewDate": "2023-10-15",
    "kegLevel": 85,
    "apiBrewUuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "brewUuid": "550e8400-e29b-41d4-a716-446655440000",
    "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "createdAt": "2023-11-15T14:30:00Z",
    "updatedAt": "2023-11-15T15:00:00Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Missing required field: recipeId"
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
  "error": "Brew not found"
}
```
or
```json
{
  "error": "Recipe not found"
}
```
