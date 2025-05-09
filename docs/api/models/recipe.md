# Recipe Model

The Recipe model represents a beer recipe in the TAPPR system. Recipes are identified by a deterministic UUID generated from the platform, author, and recipe name.

## Properties

| Property         | Type    | Description                                      | Required |
|------------------|---------|--------------------------------------------------|----------|
| id               | integer | Unique identifier for the recipe                 | Yes (auto-generated) |
| recipeId         | string  | Deterministic UUID generated from platform, author, and name | Yes (auto-generated) |
| name             | string  | Original recipe name                             | Yes      |
| normalizedName   | string  | Normalized name for matching                     | Yes (auto-generated) |
| author           | string  | Recipe author                                    | Yes      |
| normalizedAuthor | string  | Normalized author name for matching              | Yes (auto-generated) |
| platform         | string  | Source platform (e.g., "grainfather")            | Yes      |
| description      | string  | Description of the recipe                        | No       |
| style            | string  | Beer style                                       | No       |
| createdAt        | string  | Timestamp when the recipe was created (ISO 8601) | Yes (auto-generated) |
| updatedAt        | string  | Timestamp when the recipe was last updated (ISO 8601) | Yes (auto-generated) |

## Example

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

## Input Model for Creating a Recipe

When creating a new recipe, you can provide the following properties:

| Property    | Type    | Description                                      | Required |
|-------------|---------|--------------------------------------------------|----------|
| name        | string  | Recipe name                                      | Yes      |
| author      | string  | Recipe author                                    | Yes      |
| platform    | string  | Source platform (e.g., "grainfather")            | Yes      |
| description | string  | Description of the recipe                        | No       |
| style       | string  | Beer style                                       | No       |

## Example Input

```json
{
  "name": "Helles Lager",
  "author": "Jamil Zainasheff",
  "platform": "grainfather",
  "description": "A classic German lager with a clean, malty profile",
  "style": "German Helles"
}
```

## Notes

- The `id` property is auto-generated and cannot be set manually.
- The `recipeId` is deterministically generated from the platform, author, and name.
- The `normalizedName` and `normalizedAuthor` fields are auto-generated for consistent matching.
- The `createdAt` and `updatedAt` properties are auto-generated and cannot be set manually.
- The recipe ID generation uses a consistent algorithm to ensure that the same recipe (by platform, author, and name) always gets the same UUID.

## Database Mapping

The Recipe model maps to the `recipes` table in the database. The API uses camelCase property names, while the database uses snake_case column names:

| API Property     | Database Column    |
|------------------|-------------------|
| id               | id                |
| recipeId         | recipe_id         |
| name             | name              |
| normalizedName   | normalized_name   |
| author           | author            |
| normalizedAuthor | normalized_author |
| platform         | platform          |
| description      | description       |
| style            | style             |
| createdAt        | created_at        |
| updatedAt        | updated_at        |
