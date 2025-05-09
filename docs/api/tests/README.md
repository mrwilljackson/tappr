# TAPPr API Test Files

This directory contains test files for the TAPPr API endpoints. These files can be used to test the API functionality and ensure that it works as expected.

## Postman Tests

The `.postman.json` files in this directory are Postman collection files that can be imported into Postman to test specific API endpoints. Each file focuses on a specific feature or endpoint.

### Available Test Files

- **average-review-score.postman.json**: Tests for the "Get Average Review Score" endpoint, which retrieves the average review score for a specific brew.

## How to Use the Test Files

1. **Import the Test File**:
   - Open Postman
   - Click "Import" in the top left
   - Select the `.postman.json` file you want to import

2. **Set Up Environment Variables**:
   - Create a new environment or use an existing one
   - Add a variable named `baseUrl` with the value of your API's base URL:
     - For local testing: `http://localhost:3000` (or whatever port you're using)
     - For production: `https://tappr.beer`

3. **Run the Tests**:
   - Select the request you want to test
   - Make sure you have the correct environment selected
   - Click "Send" to execute the request
   - View the test results in the "Test Results" tab

## Writing New Tests

When adding new features to the API, consider creating a new test file to verify the functionality. Follow these guidelines:

1. **Name the File Appropriately**:
   - Use a descriptive name that indicates what feature or endpoint is being tested
   - Use the `.postman.json` extension for Postman collection files

2. **Include Test Scripts**:
   - Add test scripts to verify the response structure, status codes, and data types
   - Test both successful and error scenarios
   - Include examples of expected responses

3. **Document the Tests**:
   - Add a description for each request explaining what it does
   - Include example responses for different scenarios (success, error, etc.)
   - Update this README file to include the new test file

## Integration with CI/CD

These test files can be used in a CI/CD pipeline to automatically test the API when changes are made. Consider using tools like Newman (Postman's command-line collection runner) to run the tests in your CI/CD pipeline.

Example command for running tests with Newman:

```bash
newman run docs/api/tests/average-review-score.postman.json -e environment.json
```

## Related Documentation

For more information about the API endpoints being tested, refer to the following documentation:

- [API Overview](../README.md)
- [Review Endpoints](../endpoints/reviews.md)
- [Brew Endpoints](../endpoints/beers.md)
- [Recipe Endpoints](../endpoints/recipes.md)
