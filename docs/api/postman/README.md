# TAPPr Recipe API Postman Collection

This Postman collection contains requests for testing the TAPPr Recipe API endpoints, with a focus on the complete workflow for recipes, brews, and reviews.

## Setup Instructions

1. Import the `TAPPr_Recipe_API_v2.postman_collection.json` file into Postman (this is the updated version with the complete workflow).
2. The collection includes the following variables that will be automatically populated during testing:
   - `base_url`: The base URL for the TAPPr API (default: `https://tappr.beer/api`)
   - `api_key`: Your TAPPr API key (default: `tappr_api_key_12345`)
   - `recipe_id`: Recipe ID (populated after creating a recipe)
   - `recipe_db_id`: Database ID of the recipe (default: `1`)
   - `brew_id`: Brew ID (populated after creating a brew)
   - `api_brew_uuid`: API Brew UUID (populated after creating a brew)
   - `brew_uuid`: Brew UUID (populated after creating a brew)
   - `review_id`: Review ID (populated after creating a review)

3. Update the `base_url` and `api_key` variables to match your environment.

## Complete Testing Workflow

The collection is organized into folders that represent different aspects of the API. The main workflow is in the "1. Recipe Workflow" folder, which includes the following steps:

### 1. Recipe Workflow

1. **1.1 Add New Recipe**: Creates a new recipe and automatically saves the recipe ID to the collection variables.
2. **1.2 Add New Brew with Recipe**: Creates a new brew with a reference to the recipe and automatically saves the brew ID, API brew UUID, and brew UUID to the collection variables.
3. **1.3 Add Review for Brew**: Adds a review for the brew and automatically saves the review ID to the collection variables.
4. **1.4 Get Reviews by Brew UUID**: Retrieves all reviews for the brew using the API brew UUID.
5. **1.5 Get Brews by Recipe ID**: Retrieves all brews associated with the recipe.
6. **1.6 Add Standard Review for Brew**: Adds a more detailed review for the brew.

### 2. Alternative Workflows

1. **2.1 Find or Create Recipe**: Finds an existing recipe or creates a new one if it doesn't exist.
2. **2.2 Link Existing Brew to Recipe**: Links an existing brew to a recipe using the API brew UUID.
3. **2.3 Add Public Review**: Adds a public review for a brew without requiring API key authentication.

### 3-6. Additional Endpoints

The collection also includes folders for:
- **3. Recipe Management**: Endpoints for managing recipes
- **4. Brew Management**: Endpoints for managing brews
- **5. Review Management**: Endpoints for managing reviews
- **6. Utility**: Utility endpoints for recipe identification

## How to Use the Collection

1. Start with the "1. Recipe Workflow" folder to test the complete workflow from creating a recipe to adding reviews.
2. Run the requests in order (1.1, 1.2, 1.3, etc.) to ensure that the variables are properly populated.
3. After running the main workflow, you can use the other folders to test specific endpoints or alternative workflows.

## Recipe-Review Relationship

In the TAPPr API, reviews are associated with brews, not directly with recipes. The relationship works like this:

1. A recipe has a unique `recipe_id` (deterministic UUID)
2. A brew can be associated with a recipe through the `recipe_id` field
3. A review is associated with a brew through the `api_brew_uuid` field
4. To get all reviews for a recipe:
   - Get all brews associated with the recipe (using the recipe ID)
   - For each brew, get all reviews (using the API brew UUID)
   - Alternatively, use the new endpoint `/recipes/recipe-id/{recipeId}/reviews` to get all reviews for a recipe in a single request (this endpoint internally uses the `api_brew_uuid` field to establish the relationship between brews and reviews)

## Important Note About API Brew UUID

When linking a brew to a recipe, always use the `api_brew_uuid` rather than the `brew_uuid`. The `api_brew_uuid` is the primary identifier for brews in the API and is used for all relationships between brews and other entities (like recipes and reviews).

The API only supports linking brews to recipes using the API brew UUID, which ensures consistency and reliability in the relationships between entities.

## Example Data

### Example Recipe Data

```json
{
  "name": "Helles Lager",
  "author": "Jamil Zainasheff",
  "platform": "grainfather",
  "description": "A classic German lager with a clean, malty profile",
  "style": "German Helles"
}
```

### Example Brew Data with Recipe Reference

```json
{
  "name": "My Helles Lager",
  "style": "German Helles",
  "abv": 5.2,
  "ibu": 20.5,
  "description": "My version of a classic German lager",
  "brewDate": "2024-04-15",
  "kegLevel": 100,
  "recipeId": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434"
}
```

### Example Review Data

```json
{
  "apiBrewUuid": "8c0e80a3-b832-4a6d-894a-b8c07abffa49",
  "brewUuid": "dd2cba04-889d-4274-8288-0cec57020d29",
  "reviewerName": "John Doe",
  "isAnonymous": false,
  "reviewType": "quick",
  "quickReview": {
    "overallRating": 4,
    "comments": "Great Helles Lager, would drink again!"
  }
}
```
