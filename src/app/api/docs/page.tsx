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
                        },
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
            Currently, the API is open for testing purposes. In a production environment, you would need to authenticate using API keys or OAuth.
          </p>
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
