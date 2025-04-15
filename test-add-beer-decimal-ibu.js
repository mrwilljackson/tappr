// Script to test adding a beer with decimal IBU
const fetch = require('node-fetch');

async function testAddBeerWithDecimalIBU() {
  try {
    const response = await fetch('http://localhost:3001/api/beers/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X_API_Key': 'tappr_api_key_12345'
      },
      body: JSON.stringify({
        name: 'Decimal IBU Test Beer',
        style: 'IPA',
        abv: 6.2,
        ibu: 45.5, // Using a decimal IBU value
        description: 'A test beer with decimal IBU value',
        brewDate: new Date().toISOString().split('T')[0],
        kegLevel: 100
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('Beer added successfully with decimal IBU!');
      
      // Now fetch the beer to verify the IBU was stored correctly
      if (data.beer && data.beer.id) {
        const getBeerResponse = await fetch(`http://localhost:3001/api/beers/${data.beer.id}`, {
          headers: {
            'X_API_Key': 'tappr_api_key_12345'
          }
        });
        
        const beerData = await getBeerResponse.json();
        console.log('Retrieved beer data:', JSON.stringify(beerData, null, 2));
        console.log('IBU value type:', typeof beerData.ibu);
        console.log('IBU value:', beerData.ibu);
      }
    } else {
      console.error('Failed to add beer:', data.error);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAddBeerWithDecimalIBU();
