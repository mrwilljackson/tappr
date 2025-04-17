# IBU Decimal Value Fix

> **NOTE**: This documentation has been migrated to Confluence on 17-04-2024. Please refer to the [TAPPr API Documentation](https://mrwilljackson-projects.atlassian.net/wiki/spaces/API) for the most up-to-date information.

## Issue

The International Bitterness Units (IBU) field in the beer database was originally defined as an integer. However, IBU values can have decimal points, as they are often measured with precision (e.g., 45.5 IBU).

When attempting to add a beer with a decimal IBU value, the value was being truncated to an integer, resulting in loss of precision.

## Solution

The solution involves two parts:

1. **TypeScript Type Definition**: Update the TypeScript type definitions to explicitly document that IBU can have decimal values.

2. **Database Schema**: Update the Supabase database schema to change the `ibu` column type from `integer` to `double precision` (float8).

## Implementation

### TypeScript Type Updates

The `Beer` and `BeerCreateInput` interfaces in `src/types/beer.ts` have been updated to include comments indicating that IBU can have decimal values:

```typescript
export interface Beer {
  // ...other fields
  ibu?: number; // IBU can have decimal values
  // ...other fields
}

export interface BeerCreateInput {
  // ...other fields
  ibu?: number; // IBU can have decimal values
  // ...other fields
}
```

### Database Schema Update

A SQL migration script has been created to update the column type in the Supabase database:

```sql
-- Update the column type to double precision (float8)
ALTER TABLE beers
ALTER COLUMN ibu TYPE double precision USING ibu::double precision;
```

This script should be run in the Supabase SQL editor to update the column type.

## Testing

After implementing the fix, you can test it by adding a beer with a decimal IBU value:

```javascript
// Example API request
fetch('/api/beers/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X_API_Key': 'your_api_key'
  },
  body: JSON.stringify({
    name: 'Decimal IBU Test Beer',
    style: 'IPA',
    abv: 6.2,
    ibu: 45.5, // Decimal IBU value
    description: 'A test beer with decimal IBU value'
  })
})
```

## Notes

- This change is backward compatible as JavaScript numbers can represent both integers and floating-point values.
- Existing integer IBU values in the database will continue to work as expected.
- The API endpoints do not need to be modified as they already handle the IBU value as a number.
