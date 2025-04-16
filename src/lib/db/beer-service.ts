import supabase from '@/lib/supabase';
import { BrewCreateInput, Brew } from '@/types/beer';
import { v4 as uuidv4 } from 'uuid';

// Define Brew type based on your Supabase table
export type BrewDB = {
  id: number;
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  description?: string;
  brew_date: string;
  keg_level: number;
  brew_uuid: string;
  api_brew_uuid: string;
  created_at: string;
  updated_at: string;
};

// For backward compatibility
export type Beer = BrewDB;

// Get all brews from the database
export async function getAllBrews(): Promise<BrewDB[]> {
  const { data, error } = await supabase
    .from('brews')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching brews:', error);
    return [];
  }

  return data || [];
}

// For backward compatibility
export async function getAllBeers(): Promise<Beer[]> {
  return getAllBrews();
}

// Get a brew by ID
export async function getBrewById(id: number): Promise<BrewDB | null> {
  const { data, error } = await supabase
    .from('brews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching brew with ID ${id}:`, error);
    return null;
  }

  return data;
}

// For backward compatibility
export async function getBeerById(id: number): Promise<Beer | null> {
  return getBrewById(id);
}

// Get a brew by brewUuid (companion app UUID)
export async function getBrewByBrewUuid(brewUuid: string): Promise<BrewDB | null> {
  const { data, error } = await supabase
    .from('brews')
    .select('*')
    .eq('brew_uuid', brewUuid)
    .single();

  if (error) {
    console.error(`Error fetching brew with brew_uuid ${brewUuid}:`, error);
    return null;
  }

  return data;
}

// Get a brew by apiBrewUuid (API-generated UUID)
export async function getBrewByApiBrewUuid(apiBrewUuid: string): Promise<BrewDB | null> {
  const { data, error } = await supabase
    .from('brews')
    .select('*')
    .eq('api_brew_uuid', apiBrewUuid)
    .single();

  if (error) {
    console.error(`Error fetching brew with api_brew_uuid ${apiBrewUuid}:`, error);
    return null;
  }

  return data;
}

// For backward compatibility
export async function getBeerByBrewUuid(brewUuid: string): Promise<Beer | null> {
  return getBrewByBrewUuid(brewUuid);
}

// Create a new brew
export async function createBrew(data: BrewCreateInput): Promise<BrewDB | null> {
  const newBrew = {
    name: data.name,
    style: data.style,
    abv: data.abv,
    ibu: data.ibu,
    description: data.description,
    brew_date: data.brewDate || new Date().toISOString().split('T')[0],
    keg_level: data.kegLevel || 100,
    brew_uuid: data.brewUuid || uuidv4(), // Use provided UUID from companion app or generate a new one
    api_brew_uuid: uuidv4(), // Always generate a new API UUID
  };

  const { data: result, error } = await supabase
    .from('brews')
    .insert([newBrew])
    .select()
    .single();

  if (error) {
    console.error('Error creating brew:', error);
    return null;
  }

  return result;
}

// For backward compatibility
export async function createBeer(data: BeerCreateInput): Promise<Beer | null> {
  return createBrew(data);
}

// Update a brew
export async function updateBrew(id: number, data: Partial<BrewCreateInput>): Promise<BrewDB | null> {
  // First check if the brew exists
  const existingBrew = await getBrewById(id);
  if (!existingBrew) {
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
  // Note: We don't allow updating the brew_uuid or api_brew_uuid as they are immutable identifiers

  const { data: result, error } = await supabase
    .from('brews')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating brew with ID ${id}:`, error);
    return null;
  }

  return result;
}

// For backward compatibility
export async function updateBeer(id: number, data: Partial<BeerCreateInput>): Promise<Beer | null> {
  return updateBrew(id, data);
}

// Delete a brew
export async function deleteBrew(id: number): Promise<boolean> {
  // First check if the brew exists
  const existingBrew = await getBrewById(id);
  if (!existingBrew) {
    return false;
  }

  // Delete the brew
  const { error } = await supabase
    .from('brews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting brew with ID ${id}:`, error);
    return false;
  }

  return true;
}

// For backward compatibility
export async function deleteBeer(id: number): Promise<boolean> {
  return deleteBrew(id);
}
