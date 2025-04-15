import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Database file path
const DB_PATH = path.join(process.cwd(), 'tappr.db');

// Create a singleton database connection
let db: ReturnType<typeof createDbConnection> | null = null;

function createDbConnection() {
  // Create a connection to the SQLite database
  const sqlite = new Database(DB_PATH);

  // Create the drizzle database instance
  const dbInstance = drizzle(sqlite);

  return dbInstance;
}

// Get the database connection (creates it if it doesn't exist)
export function getDb() {
  if (!db) {
    db = createDbConnection();

    // Initialize the database if needed
    initializeDb();
  }

  return db;
}

// Initialize the database with tables if they don't exist
function initializeDb() {
  const sqlite = new Database(DB_PATH);

  // Create the beers table if it doesn't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS beers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      style TEXT NOT NULL,
      abv REAL NOT NULL,
      ibu INTEGER,
      description TEXT,
      brew_date TEXT NOT NULL,
      keg_level INTEGER NOT NULL DEFAULT 100,
      brew_uuid TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create the reviews table if it doesn't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id TEXT NOT NULL UNIQUE,
      brew_uuid TEXT NOT NULL,
      reviewer_id TEXT,
      reviewer_name TEXT,
      is_anonymous INTEGER NOT NULL DEFAULT 0,
      review_date TEXT NOT NULL,
      review_type TEXT NOT NULL,
      quick_review TEXT NOT NULL,
      standard_review TEXT,
      expert_review TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if the beers table is empty and seed with sample data if needed
  const count = sqlite.prepare('SELECT COUNT(*) as count FROM beers').get() as { count: number };

  if (count.count === 0) {
    // Seed with sample data
    const sampleBeers = [
      {
        name: 'Hoppy IPA',
        style: 'India Pale Ale',
        abv: 6.5,
        ibu: 65,
        description: 'A hoppy IPA with citrus and pine notes',
        brew_date: '2023-10-15',
        keg_level: 85,
        brew_uuid: uuidv4(),
      },
      {
        name: 'Chocolate Stout',
        style: 'Stout',
        abv: 7.2,
        ibu: 35,
        description: 'Rich stout with chocolate and coffee flavors',
        brew_date: '2023-11-20',
        keg_level: 92,
        brew_uuid: uuidv4(),
      },
      {
        name: 'Belgian Wit',
        style: 'Witbier',
        abv: 5.0,
        ibu: 15,
        description: 'Light and refreshing with orange and coriander',
        brew_date: '2024-01-05',
        keg_level: 45,
        brew_uuid: uuidv4(),
      },
    ];

    const insert = sqlite.prepare(`
      INSERT INTO beers (name, style, abv, ibu, description, brew_date, keg_level, brew_uuid)
      VALUES (@name, @style, @abv, @ibu, @description, @brew_date, @keg_level, @brew_uuid)
    `);

    for (const beer of sampleBeers) {
      insert.run(beer);
    }

    console.log('Database seeded with sample data');
  }

  sqlite.close();
}
