import { eq } from 'drizzle-orm';
import { getDb } from './index';
import { beers, Beer, NewBeer } from './schema';
import { BeerCreateInput } from '@/types/beer';
import { v4 as uuidv4 } from 'uuid';

// Get all beers from the database
export async function getAllBeers(): Promise<Beer[]> {
  const db = getDb();
  return db.select().from(beers).all();
}

// Get a beer by ID
export async function getBeerById(id: number): Promise<Beer | undefined> {
  const db = getDb();
  const result = db.select().from(beers).where(eq(beers.id, id)).all();
  return result[0];
}

// Create a new beer
export async function createBeer(data: BeerCreateInput): Promise<Beer> {
  const db = getDb();

  const newBeer: NewBeer = {
    name: data.name,
    style: data.style,
    abv: data.abv,
    ibu: data.ibu,
    description: data.description,
    brewDate: data.brewDate || new Date().toISOString().split('T')[0],
    kegLevel: data.kegLevel || 100,
    brewUuid: data.brewUuid || uuidv4(), // Use provided UUID or generate a new one
  };

  const result = db.insert(beers).values(newBeer).returning().all();
  return result[0];
}

// Update a beer
export async function updateBeer(id: number, data: Partial<BeerCreateInput>): Promise<Beer | undefined> {
  const db = getDb();

  // First check if the beer exists
  const existingBeer = await getBeerById(id);
  if (!existingBeer) {
    return undefined;
  }

  // Update the beer
  const updateData: Partial<NewBeer> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const result = db.update(beers)
    .set(updateData)
    .where(eq(beers.id, id))
    .returning()
    .all();

  return result[0];
}

// Delete a beer
export async function deleteBeer(id: number): Promise<boolean> {
  const db = getDb();

  // First check if the beer exists
  const existingBeer = await getBeerById(id);
  if (!existingBeer) {
    return false;
  }

  // Delete the beer
  db.delete(beers).where(eq(beers.id, id)).run();
  return true;
}
