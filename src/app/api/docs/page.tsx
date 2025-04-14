import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-patua">TAPPR API Documentation</h1>

      <div className="mb-8">
        <p className="text-gray-600 mb-4 font-montserrat">
          Welcome to the TAPPR API documentation. This API allows you to interact with beer data for your homebrewing needs.
        </p>
      </div>

      <div className="space-y-8">
        <section className="border-b pb-6">
          <h2 className="text-2xl font-bold mb-4 font-patua">Endpoints</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 font-patua">Get All Beers</h3>
              <div className="bg-gray-100 p-3 rounded mb-2">
                <code>GET /api/beers</code>
              </div>
              <p className="text-gray-600 mb-2 font-montserrat">Returns a list of all beers.</p>
              <div className="bg-gray-100 p-3 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify([
                    {
                      id: 1,
                      name: 'Hoppy IPA',
                      style: 'India Pale Ale',
                      abv: 6.5,
                      // other fields...
                    }
                  ], null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 font-patua">Get Beer by ID</h3>
              <div className="bg-gray-100 p-3 rounded mb-2">
                <code>GET /api/beers/{'{id}'}</code>
              </div>
              <p className="text-gray-600 mb-2 font-montserrat">Returns a specific beer by ID.</p>
              <div className="bg-gray-100 p-3 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(
                    {
                      id: 1,
                      name: 'Hoppy IPA',
                      style: 'India Pale Ale',
                      abv: 6.5,
                      ibu: 65,
                      description: 'A hoppy IPA with citrus and pine notes',
                      brewDate: '2023-10-15',
                      kegLevel: 85,
                      brewUuid: '550e8400-e29b-41d4-a716-446655440000',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 font-patua">Add New Beer</h3>
              <div className="bg-gray-100 p-3 rounded mb-2">
                <code>POST /api/beers/add</code>
              </div>
              <p className="text-gray-600 mb-2 font-montserrat">Adds a new beer to the system.</p>
              <div className="mb-2">
                <h4 className="font-semibold font-patua">Request Body:</h4>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        name: 'New Beer',
                        style: 'IPA',
                        abv: 5.5,
                        ibu: 40,
                        description: 'Description of the beer',
                        brewDate: '2024-04-01', // Optional
                        kegLevel: 100, // Optional
                        brewUuid: '550e8400-e29b-41d4-a716-446655440001' // Optional, will be generated if not provided
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold font-patua">Response:</h4>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        message: 'Beer added successfully',
                        beer: {
                          id: 4,
                          name: 'New Beer',
                          style: 'IPA',
                          abv: 5.5,
                          ibu: 40,
                          description: 'Description of the beer',
                          brewDate: '2024-04-01',
                          kegLevel: 100,
                          brewUuid: '550e8400-e29b-41d4-a716-446655440001',
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 font-patua">Update Beer</h3>
              <div className="bg-gray-100 p-3 rounded mb-2">
                <code>PATCH /api/beers/{'{id}'}/update</code>
              </div>
              <p className="text-gray-600 mb-2 font-montserrat">Updates an existing beer.</p>
              <div className="mb-2">
                <h4 className="font-semibold font-patua">Request Body:</h4>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        name: 'Updated Beer Name', // Only include fields you want to update
                        kegLevel: 75,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold font-patua">Response:</h4>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        message: 'Beer updated successfully',
                        beer: {
                          id: 1,
                          name: 'Updated Beer Name',
                          style: 'India Pale Ale',
                          abv: 6.5,
                          ibu: 65,
                          description: 'A hoppy IPA with citrus and pine notes',
                          brewDate: '2023-10-15',
                          kegLevel: 75,
                          brewUuid: '550e8400-e29b-41d4-a716-446655440000',
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 font-patua">Delete Beer</h3>
              <div className="bg-gray-100 p-3 rounded mb-2">
                <code>DELETE /api/beers/{'{id}'}/delete</code>
              </div>
              <p className="text-gray-600 mb-2 font-montserrat">Deletes a beer from the system.</p>
              <div>
                <h4 className="font-semibold font-patua">Response:</h4>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        message: 'Beer deleted successfully',
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 font-patua">Authentication</h2>
          <p className="text-gray-600 mb-2 font-montserrat">
            The API is protected with an API key. You must include the API key in the header of each request.
          </p>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2 font-patua">API Key Authentication</h3>
            <p className="text-gray-600 mb-2 font-montserrat">
              Include the API key in the <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key</code> header of your requests.
            </p>

            <div className="bg-gray-100 p-3 rounded mb-4">
              <pre className="text-sm overflow-auto">
                {`// Example using fetch
fetch('https://your-api-url.com/api/beers', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
})`}
              </pre>
            </div>

            <div className="bg-gray-100 p-3 rounded mb-4">
              <pre className="text-sm overflow-auto">
                {`// Example using axios
axios.get('https://your-api-url.com/api/beers', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
})`}
              </pre>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              <pre className="text-sm overflow-auto">
                {`// Example using curl
curl -X GET \
  -H "X-API-Key: your-api-key-here" \
  https://your-api-url.com/api/beers`}
              </pre>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-amber-600 hover:text-amber-800 font-montserrat">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
