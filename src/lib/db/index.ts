import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Database file path - use /tmp in production for writable directory
const DB_PATH = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'tappr.db')
  : path.join(process.cwd(), 'tappr.db');

// Create a singleton database connection
let db: ReturnType<typeof createDbConnection> | null = null;

function createDbConnection() {
  try {
    console.log(`Creating database connection to ${DB_PATH}`);

    // Create a connection to the SQLite database
    const sqlite = new Database(DB_PATH);

    // Create the drizzle database instance
    const dbInstance = drizzle(sqlite);

    console.log('Database connection created successfully');
    return dbInstance;
  } catch (error) {
    console.error('Error creating database connection:', error);
    throw error;
  }
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
  try {
    console.log('Initializing database...');
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
        brew_uuid: '7dfb14c4-d288-4b1e-ae69-ec2d733aa434', // Fixed UUID for consistent reference
      },
      {
        name: 'Chocolate Stout',
        style: 'Stout',
        abv: 7.2,
        ibu: 35,
        description: 'Rich stout with chocolate and coffee flavors',
        brew_date: '2023-11-20',
        keg_level: 92,
        brew_uuid: '6acb7636-541c-45c8-8ae5-131af583477c', // Fixed UUID for consistent reference
      },
      {
        name: 'Belgian Wit',
        style: 'Witbier',
        abv: 5.0,
        ibu: 15,
        description: 'Light and refreshing with orange and coriander',
        brew_date: '2024-01-05',
        keg_level: 45,
        brew_uuid: '5f276576-c996-4cc1-9e48-d628bd257080', // Fixed UUID for consistent reference
      },
    ];

    const insert = sqlite.prepare(`
      INSERT INTO beers (name, style, abv, ibu, description, brew_date, keg_level, brew_uuid)
      VALUES (@name, @style, @abv, @ibu, @description, @brew_date, @keg_level, @brew_uuid)
    `);

    for (const beer of sampleBeers) {
      insert.run(beer);
    }

    console.log('Database seeded with sample beers');

    // Check if the reviews table is empty and seed with sample data if needed
    const reviewCount = sqlite.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };

    if (reviewCount.count === 0) {
      // Seed with sample reviews
      const sampleReviews = [
        {
          review_id: '8c6e2146-6ad2-4f2a-a9f5-f7ad8ebf2a06',
          brew_uuid: '7dfb14c4-d288-4b1e-ae69-ec2d733aa434', // Hoppy IPA
          reviewer_name: 'Sample Reviewer 1',
          is_anonymous: 0,
          review_date: new Date().toISOString(),
          review_type: 'quick',
          quick_review: JSON.stringify({
            overallRating: 4,
            comments: 'Great beer, very hoppy!'
          }),
          standard_review: null,
          expert_review: null
        },
        {
          review_id: '9d7f25e7-7b3c-4d1a-b6e8-f8a9b5c7d6e5',
          brew_uuid: '6acb7636-541c-45c8-8ae5-131af583477c', // Chocolate Stout
          reviewer_name: 'Sample Reviewer 2',
          is_anonymous: 0,
          review_date: new Date().toISOString(),
          review_type: 'standard',
          quick_review: JSON.stringify({
            overallRating: 5,
            comments: 'Excellent stout!'
          }),
          standard_review: JSON.stringify({
            appearance: 5,
            aroma: 4,
            taste: 5,
            mouthfeel: 4,
            comments: 'Rich chocolate flavor with coffee notes.'
          }),
          expert_review: null
        }
      ];

      const insertReview = sqlite.prepare(`
        INSERT INTO reviews (review_id, brew_uuid, reviewer_name, is_anonymous, review_date, review_type, quick_review, standard_review, expert_review)
        VALUES (@review_id, @brew_uuid, @reviewer_name, @is_anonymous, @review_date, @review_type, @quick_review, @standard_review, @expert_review)
      `);

      for (const review of sampleReviews) {
        insertReview.run(review);
      }

      console.log('Database seeded with sample reviews');
    }
  }

  sqlite.close();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
