#!/bin/bash

# Test adding a beer via the API
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X_API_Key: tappr_api_key_12345" \
  -d '{
    "name": "Curl Test Beer",
    "style": "API Test",
    "abv": 6.5,
    "ibu": 45,
    "description": "A test beer created via curl",
    "brewDate": "'$(date +%Y-%m-%d)'",
    "kegLevel": 100
  }' \
  http://localhost:3001/api/beers/add
