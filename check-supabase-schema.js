// Script to check the Supabase schema for the beers table
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    // Get the schema information for the beers table
    const { data, error } = await supabase
      .from('beers')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Sample beer data:', data[0]);
      console.log('IBU value type:', typeof data[0].ibu);
      console.log('IBU value:', data[0].ibu);
    } else {
      console.log('No beers found in the database');
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

checkSchema();
