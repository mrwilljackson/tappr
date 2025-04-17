# Brew Endpoints

## Get All Brews

Retrieves a list of all brews.

**URL**: `/beers`

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
    "name": "Hoppy IPA",
    "style": "India Pale Ale",
    "abv": 6.5,
    "ibu": 65.5,
    "description": "A hoppy IPA with citrus and pine notes",
    "brew_date": "2023-10-15",
    "keg_level": 85,
    "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2023-11-15T14:30:00Z",
    "updated_at": "2023-11-15T14:30:00Z"
  },
  // More beers...
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

## Get Brew by ID

Retrieves a specific brew by its ID.

**URL**: `/beers/{id}`

**Method**: `GET`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `id`: The ID of the brew to retrieve

**Success Response**:
- **Code**: 200 OK
- **Content**:
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
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
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
  "error": "Brew not found"
}
```

## Get Brew by UUID (Public)

Retrieves a specific brew by its UUID. This endpoint is public and does not require authentication.

**URL**: `/beers/public/{brewUuid}`

**Method**: `GET`

**Authentication Required**: No

**URL Parameters**:
- `brewUuid`: The UUID of the brew to retrieve (companion app UUID)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": 1,
  "name": "Hoppy IPA",
  "style": "India Pale Ale",
  "abv": 6.5,
  "ibu": 65.5,
  "description": "A hoppy IPA with citrus and pine notes",
  "brew_date": "2023-10-15",
  "keg_level": 85,
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2023-11-15T14:30:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Brew not found"
}
```

## Get Brew by API UUID (Public)

Retrieves a specific brew by its API-generated UUID. This endpoint is public and does not require authentication.

**URL**: `/beers/public/api/{apiBrewUuid}`

**Method**: `GET`

**Authentication Required**: No

**URL Parameters**:
- `apiBrewUuid`: The API-generated UUID of the brew to retrieve

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "id": 1,
  "name": "Hoppy IPA",
  "style": "India Pale Ale",
  "abv": 6.5,
  "ibu": 65.5,
  "description": "A hoppy IPA with citrus and pine notes",
  "brew_date": "2023-10-15",
  "keg_level": 85,
  "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
  "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2023-11-15T14:30:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "error": "Brew not found"
}
```

## Add New Brew

Adds a new brew to the system.

**URL**: `/beers/add`

**Method**: `POST`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**Request Body**:
```json
{
  "name": "New Brew",
  "style": "IPA",
  "abv": 5.5,
  "ibu": 40.5,
  "description": "Description of the brew",
  "brewDate": "2024-04-01",
  "kegLevel": 100,
  "brewUuid": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "message": "Brew added successfully",
  "brew": {
    "id": 4,
    "name": "New Brew",
    "style": "IPA",
    "abv": 5.5,
    "ibu": 40.5,
    "description": "Description of the brew",
    "brew_date": "2024-04-01",
    "keg_level": 100,
    "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "brew_uuid": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2024-04-15T14:30:00Z",
    "updated_at": "2024-04-15T14:30:00Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "error": "Missing required fields"
}
```

- **Code**: 401 Unauthorized
- **Content**:
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

## Update Brew

Updates an existing brew.

**URL**: `/beers/{id}/update`

**Method**: `PATCH`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key
- `Content-Type`: application/json

**URL Parameters**:
- `id`: The ID of the brew to update

**Request Body**:
```json
{
  "name": "Updated Beer Name",
  "kegLevel": 75
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Brew updated successfully",
  "brew": {
    "id": 1,
    "name": "Updated Brew Name",
    "style": "India Pale Ale",
    "abv": 6.5,
    "ibu": 65.5,
    "description": "A hoppy IPA with citrus and pine notes",
    "brew_date": "2023-10-15",
    "keg_level": 75,
    "api_brew_uuid": "7dfb14c4-d288-4b1e-ae69-ec2d733aa434",
    "brew_uuid": "550e8400-e29b-41d4-a716-446655440000",
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
  "error": "Brew not found"
}
```

## Delete Brew

Deletes a brew from the system.

**URL**: `/beers/{id}/delete`

**Method**: `DELETE`

**Authentication Required**: Yes

**Headers**:
- `X_API_Key`: Your API key

**URL Parameters**:
- `id`: The ID of the brew to delete

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Brew deleted successfully"
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
  "error": "Brew not found"
}
```

## Database Mapping

The beer endpoints interact with the `beers` table in the Supabase database. The API handles the conversion between camelCase (used in the API) and snake_case (used in the database) property names.

### Property Mapping

| API Property | Database Column |
|--------------|------------------|
| id | id |
| name | name |
| style | style |
| abv | abv |
| ibu | ibu |
| description | description |
| brewDate | brew_date |
| kegLevel | keg_level |
| brewUuid | brew_uuid |
| createdAt | created_at |
| updatedAt | updated_at |

### Notes

- The `ibu` field is stored as a `double precision` (float8) in the database to allow for decimal values.
- Date fields are stored as text in ISO format for simplicity and compatibility.
- The `brew_uuid` field serves as a stable identifier for beers, especially useful for public endpoints.
