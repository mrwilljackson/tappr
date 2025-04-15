# TAPPR API Documentation

Welcome to the TAPPR API documentation. This API allows you to interact with beer data for your homebrewing needs.

## Base URL

```
https://tappr.beer/api
```

## Authentication

Most API endpoints are protected with an API key. You must include the API key in the header of each request.

### API Key Authentication

Include the API key in the `X_API_Key` header of your requests.

```bash
# Example using curl
curl -X GET -H "X_API_Key: your-api-key-here" https://tappr.beer/api/beers
```

```javascript
// Example using fetch
fetch('https://tappr.beer/api/beers', {
  headers: {
    'X_API_Key': 'your-api-key-here'
  }
})
```

## Public Endpoints

The following endpoints do not require authentication:

- `GET /api/beers/public/{brewUuid}` - Get a specific beer by its UUID
- `POST /api/reviews/public/add` - Submit a review for a beer

## Available Endpoints

### Beer Endpoints

- [Get All Beers](./endpoints/beers.md#get-all-beers)
- [Get Beer by ID](./endpoints/beers.md#get-beer-by-id)
- [Get Beer by UUID (Public)](./endpoints/beers.md#get-beer-by-uuid-public)
- [Add New Beer](./endpoints/beers.md#add-new-beer)
- [Update Beer](./endpoints/beers.md#update-beer)
- [Delete Beer](./endpoints/beers.md#delete-beer)

### Review Endpoints

- [Get All Reviews](./endpoints/reviews.md#get-all-reviews)
- [Get Review by ID](./endpoints/reviews.md#get-review-by-id)
- [Get Reviews by Brew UUID](./endpoints/reviews.md#get-reviews-by-brew-uuid)
- [Add Review](./endpoints/reviews.md#add-review)
- [Add Public Review](./endpoints/reviews.md#add-public-review)
- [Update Review](./endpoints/reviews.md#update-review)
- [Delete Review](./endpoints/reviews.md#delete-review)

## Data Models

- [Beer Model](./models/beer.md)
- [Review Model](./models/review.md)

## Database Mapping

The API uses Supabase as its database backend. The following tables are used to store data:

- `beers` - Stores beer information
- `reviews` - Stores beer reviews

For detailed information about how API data is mapped to the database schema, please refer to:

- [Database Schema](./database-schema.md)

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

- `200 OK` - The request was successful
- `201 Created` - The resource was successfully created
- `400 Bad Request` - The request was invalid
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - The requested resource was not found
- `500 Internal Server Error` - An error occurred on the server

Error responses will include a JSON object with an `error` property containing a message describing the error.

```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

## Rate Limiting

Currently, there are no rate limits on the API. However, we reserve the right to implement rate limiting in the future to ensure the stability of the service.

## Support

If you have any questions or need help with the API, please contact us at support@tappr.beer.
