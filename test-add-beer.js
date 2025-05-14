// Simple script to test the beer addition API
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables from .env file

// Get API key from environment variables
const API_KEY = process.env.TAPPR_DEV_API_KEY || process.env.TAPPR_API_KEY || '';

if (!API_KEY) {
  console.error('Error: No API key found. Please set TAPPR_DEV_API_KEY or TAPPR_API_KEY in your .env file.');
  process.exit(1);
}

async function testAddBeer() {
  try {
    const response = await fetch('http://localhost:3001/api/beers/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X_API_Key': API_KEY
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
