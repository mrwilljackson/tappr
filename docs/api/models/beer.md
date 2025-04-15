# Beer Model

The Beer model represents a beer in the TAPPR system.

## Properties

| Property    | Type    | Description                                      | Required |
|-------------|---------|--------------------------------------------------|----------|
| id          | integer | Unique identifier for the beer                   | Yes (auto-generated) |
| name        | string  | Name of the beer                                | Yes      |
| style       | string  | Style of the beer (e.g., IPA, Stout)            | Yes      |
| abv         | number  | Alcohol by volume percentage                     | Yes      |
| ibu         | integer | International Bitterness Units                   | No       |
| description | string  | Description of the beer                          | No       |
| brew_date   | string  | Date the beer was brewed (ISO 8601 format)       | Yes      |
| keg_level   | integer | Current level of the keg (0-100)                 | Yes (defaults to 100) |
| brew_uuid   | string  | Unique UUID for the beer                         | Yes (auto-generated if not provided) |
| created_at  | string  | Timestamp when the beer was created (ISO 8601)   | Yes (auto-generated) |
| updated_at  | string  | Timestamp when the beer was last updated (ISO 8601) | Yes (auto-generated) |

## Example

```json
{
  "id": 1,
  "name": "Hoppy IPA",
  "style": "India Pale Ale",
  "abv": 6.5,
  "ibu": 65,
  "description": "A hoppy IPA with citrus and pine notes",
  "brew_date": "2023-10-15",
  "keg_level": 85,
  "brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "created_at": "2023-11-15T14:30:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

## Input Model for Creating a Beer

When creating a new beer, you can provide the following properties:

| Property    | Type    | Description                                      | Required |
|-------------|---------|--------------------------------------------------|----------|
| name        | string  | Name of the beer                                | Yes      |
| style       | string  | Style of the beer (e.g., IPA, Stout)            | Yes      |
| abv         | number  | Alcohol by volume percentage                     | Yes      |
| ibu         | integer | International Bitterness Units                   | No       |
| description | string  | Description of the beer                          | No       |
| brewDate    | string  | Date the beer was brewed (ISO 8601 format)       | No (defaults to current date) |
| kegLevel    | integer | Current level of the keg (0-100)                 | No (defaults to 100) |
| brewUuid    | string  | Unique UUID for the beer                         | No (auto-generated if not provided) |

## Example Input

```json
{
  "name": "New Beer",
  "style": "IPA",
  "abv": 5.5,
  "ibu": 40,
  "description": "Description of the beer",
  "brewDate": "2024-04-01",
  "kegLevel": 100,
  "brewUuid": "550e8400-e29b-41d4-a716-446655440001"
}
```

## Notes

- The `id` property is auto-generated and cannot be set manually.
- The `created_at` and `updated_at` properties are auto-generated and cannot be set manually.
- If `brewUuid` is not provided, a new UUID will be generated.
- If `brewDate` is not provided, the current date will be used.
- If `kegLevel` is not provided, it will default to 100 (full keg).
