// This file is kept for backward compatibility
// It now re-exports the Supabase client from src/lib/supabase.ts

import supabase from '../supabase';

// Export the Supabase client as the default export
export default supabase;

// For backward compatibility, provide a getDb function that returns the Supabase client
export function getDb() {
  return supabase;
}
