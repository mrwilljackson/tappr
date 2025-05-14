#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Use the development API key if available, otherwise use the production API key
API_KEY=${TAPPR_DEV_API_KEY:-${TAPPR_API_KEY}}

if [ -z "$API_KEY" ]; then
  echo "Error: No API key found. Please set TAPPR_DEV_API_KEY or TAPPR_API_KEY in your .env file."
  exit 1
fi

# Test adding a beer via the API
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X_API_Key: $API_KEY" \
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
