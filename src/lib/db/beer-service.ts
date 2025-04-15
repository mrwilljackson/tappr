import supabase from '@/lib/supabase';
import { BeerCreateInput } from '@/types/beer';
import { v4 as uuidv4 } from 'uuid';

// Define Beer type based on your Supabase table
export type Beer = {
  id: number;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description?: string;
  brew_date: string;
  keg_level: number;
  brew_uuid: string;
  created_at: string;
  updated_at: string;
};

// Get all beers from the database
export async function getAllBeers(): Promise<Beer[]> {
  const { data, error } = await supabase
    .from('beers')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching beers:', error);
    return [];
  }

  return data || [];
}

// Get a beer by ID
export async function getBeerById(id: number): Promise<Beer | null> {
  const { data, error } = await supabase
    .from('beers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching beer with ID ${id}:`, error);
    return null;
  }

  return data;
}

// Get a beer by brewUuid
export async function getBeerByBrewUuid(brewUuid: string): Promise<Beer | null> {
  const { data, error } = await supabase
    .from('beers')
    .select('*')
    .eq('brew_uuid', brewUuid)
    .single();

  if (error) {
    console.error(`Error fetching beer with UUID ${brewUuid}:`, error);
    return null;
  }

  return data;
}

// Create a new beer
export async function createBeer(data: BeerCreateInput): Promise<Beer | null> {
  const newBeer = {
    name: data.name,
    style: data.style,
    abv: data.abv,
    ibu: data.ibu,
    description: data.description,
    brew_date: data.brewDate || new Date().toISOString().split('T')[0],
    keg_level: data.kegLevel || 100,
    brew_uuid: data.brewUuid || uuidv4(), // Use provided UUID or generate a new one
  };

  const { data: result, error } = await supabase
    .from('beers')
    .insert([newBeer])
    .select()
    .single();

  if (error) {
    console.error('Error creating beer:', error);
    return null;
  }

  return result;
}

// Update a beer
export async function updateBeer(id: number, data: Partial<BeerCreateInput>): Promise<Beer | null> {
  // First check if the beer exists
  const existingBeer = await getBeerById(id);
  if (!existingBeer) {
    return null;
  }

  // Prepare update data with proper field names
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.style !== undefined) updateData.style = data.style;
  if (data.abv !== undefined) updateData.abv = data.abv;
  if (data.ibu !== undefined) updateData.ibu = data.ibu;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.brewDate !== undefined) updateData.brew_date = data.brewDate;
  if (data.kegLevel !== undefined) updateData.keg_level = data.kegLevel;

  const { data: result, error } = await supabase
    .from('beers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating beer with ID ${id}:`, error);
    return null;
  }

  return result;
}

// Delete a beer
export async function deleteBeer(id: number): Promise<boolean> {
  // First check if the beer exists
  const existingBeer = await getBeerById(id);
  if (!existingBeer) {
    return false;
  }

  // Delete the beer
  const { error } = await supabase
    .from('beers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting beer with ID ${id}:`, error);
    return false;
  }

  return true;
}
