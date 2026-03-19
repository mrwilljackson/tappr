import sql from '@/lib/neon';
import { BrewCreateInput } from '@/types/beer';
import { v4 as uuidv4 } from 'uuid';

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
  recipe_id?: string;
  created_at: string;
  updated_at: string;
};

// For backward compatibility
export type Beer = BrewDB;

export async function getAllBrews(): Promise<BrewDB[]> {
  try {
    const result = await sql`SELECT * FROM brews ORDER BY id`;
    return result as BrewDB[];
  } catch (error) {
    console.error('Error fetching brews:', error);
    return [];
  }
}

export async function getAllBeers(): Promise<Beer[]> {
  return getAllBrews();
}

export async function getBrewById(id: number): Promise<BrewDB | null> {
  try {
    const result = await sql`SELECT * FROM brews WHERE id = ${id}`;
    return (result[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error fetching brew with ID ${id}:`, error);
    return null;
  }
}

export async function getBeerById(id: number): Promise<Beer | null> {
  return getBrewById(id);
}

export async function getBrewByBrewUuid(brewUuid: string): Promise<BrewDB | null> {
  try {
    const result = await sql`SELECT * FROM brews WHERE brew_uuid = ${brewUuid}`;
    return (result[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error fetching brew with brew_uuid ${brewUuid}:`, error);
    return null;
  }
}

export async function getBrewByApiBrewUuid(apiBrewUuid: string): Promise<BrewDB | null> {
  try {
    const result = await sql`SELECT * FROM brews WHERE api_brew_uuid = ${apiBrewUuid}`;
    return (result[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error fetching brew with api_brew_uuid ${apiBrewUuid}:`, error);
    return null;
  }
}

export async function getBeerByBrewUuid(brewUuid: string): Promise<Beer | null> {
  return getBrewByBrewUuid(brewUuid);
}

export async function createBrew(data: BrewCreateInput): Promise<BrewDB | null> {
  const name        = data.name;
  const style       = data.style;
  const abv         = data.abv;
  const ibu         = data.ibu ?? null;
  const description = data.description ?? null;
  const brew_date   = data.brewDate || new Date().toISOString().split('T')[0];
  const keg_level   = data.kegLevel ?? 100;
  const brew_uuid   = data.brewUuid || uuidv4();
  const api_brew_uuid = uuidv4();
  const recipe_id   = data.recipeId ?? null;

  try {
    const result = await sql`
      INSERT INTO brews (name, style, abv, ibu, description, brew_date, keg_level, brew_uuid, api_brew_uuid, recipe_id)
      VALUES (${name}, ${style}, ${abv}, ${ibu}, ${description}, ${brew_date}, ${keg_level}, ${brew_uuid}, ${api_brew_uuid}, ${recipe_id})
      RETURNING *
    `;
    return (result[0] as BrewDB) || null;
  } catch (error) {
    console.error('Error creating brew:', error);
    return null;
  }
}

export async function createBeer(data: BrewCreateInput): Promise<Beer | null> {
  return createBrew(data);
}

export async function updateBrew(id: number, data: Partial<BrewCreateInput>): Promise<BrewDB | null> {
  const existingBrew = await getBrewById(id);
  if (!existingBrew) return null;

  const name        = data.name        ?? existingBrew.name;
  const style       = data.style       ?? existingBrew.style;
  const abv         = data.abv         ?? existingBrew.abv;
  const ibu         = data.ibu         ?? existingBrew.ibu         ?? null;
  const description = data.description ?? existingBrew.description ?? null;
  const brew_date   = data.brewDate    ?? existingBrew.brew_date;
  const keg_level   = data.kegLevel    ?? existingBrew.keg_level;
  const recipe_id   = data.recipeId    ?? existingBrew.recipe_id   ?? null;

  try {
    const result = await sql`
      UPDATE brews
      SET name = ${name}, style = ${style}, abv = ${abv}, ibu = ${ibu},
          description = ${description}, brew_date = ${brew_date}, keg_level = ${keg_level},
          recipe_id = ${recipe_id}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return (result[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error updating brew with ID ${id}:`, error);
    return null;
  }
}

export async function updateBeer(id: number, data: Partial<BrewCreateInput>): Promise<Beer | null> {
  return updateBrew(id, data);
}

export async function deleteBrew(id: number): Promise<boolean> {
  const existingBrew = await getBrewById(id);
  if (!existingBrew) return false;

  try {
    await sql`DELETE FROM brews WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error(`Error deleting brew with ID ${id}:`, error);
    return false;
  }
}

export async function deleteBeer(id: number): Promise<boolean> {
  return deleteBrew(id);
}
