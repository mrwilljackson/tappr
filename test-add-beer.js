// Simple script to test the beer addition API
const fetch = require('node-fetch');

async function testAddBeer() {
  try {
    const response = await fetch('http://localhost:3001/api/beers/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X_API_Key': 'tappr_api_key_12345'
      },
      body: JSON.stringify({
        name: 'Test Beer ' + new Date().toISOString(),
        style: 'Test Style',
        abv: 5.0,
        ibu: 30,
        description: 'This is a test beer created via API',
        brewDate: new Date().toISOString().split('T')[0],
        kegLevel: 100
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('Beer added successfully!');
    } else {
      console.error('Failed to add beer:', data.error);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAddBeer();
