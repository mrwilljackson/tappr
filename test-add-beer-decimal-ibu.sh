#!/bin/bash

# Test adding a beer with decimal IBU via the API
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X_API_Key: tappr_api_key_12345" \
  -d '{
    "name": "Curl Decimal IBU Test Beer",
    "style": "Double IPA",
    "abv": 7.8,
    "ibu": 65.7,
    "description": "A test beer with decimal IBU created via curl",
    "brewDate": "'$(date +%Y-%m-%d)'",
    "kegLevel": 100
  }' \
  http://localhost:3001/api/beers/add
