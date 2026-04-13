# Database Migration: Supabase to Neon PostgreSQL

This checklist provides step-by-step instructions for migrating the TAPPr database from Supabase to Neon PostgreSQL.

---

## Implementation Task Tracker

Track code implementation progress across sessions. Check off each item as it is completed.

### Package Changes
- [x] Install `@neondatabase/serverless`: `npm install @neondatabase/serverless`
- [x] Uninstall `@supabase/supabase-js`: `npm uninstall @supabase/supabase-js`

### New / Deleted Files
- [x] Create `src/lib/neon.ts` (new Neon client)
- [x] Delete `src/lib/supabase.ts`

### Service Layer
- [x] Rewrite `src/lib/db/index.ts` (export Neon client instead of Supabase)
- [x] Rewrite `src/lib/db/beer-service.ts`
- [x] Rewrite `src/lib/db/recipe-service.ts`
- [x] Rewrite `src/lib/db/review-service.ts`

### API Routes (direct Supabase imports)
- [x] Update `src/app/api/recipes/recipe-id/[recipeId]/brews/route.ts`
- [x] Update `src/app/api/brews/api/[apiBrewUuid]/link-recipe/route.ts`
- [x] Update `src/app/api/recipes/recipe-id/[recipeId]/reviews/route.ts`

### Config & Docs
- [x] Update `.env.example` (remove Supabase vars, add `DATABASE_URL`)
- [x] Update `CLAUDE.md` (database section + env vars)

### Verification
- [x] `npm run build` passes with no TypeScript errors
- [x] `npm run lint` passes clean (6 pre-existing errors in UI components unrelated to migration)
- [x] All API endpoints tested locally against Neon (see Phase 4)

### Security (pre-deployment)
- [ ] `npm audit` — review all vulnerabilities, resolve any high or critical before deploying
- [ ] No secrets or credentials committed to git (`git log --all --full-history -- .env*`)
- [ ] `DATABASE_URL` added to Vercel environment variables (not hardcoded anywhere in code)
- [ ] Confirm `src/db/backups/` is gitignored and not present in remote (`git ls-files src/db/backups/`)
- [ ] Review Neon dashboard — restrict database user permissions if possible (read/write only, no DDL)
- [ ] Confirm `sslmode=require` is present in `DATABASE_URL` (already set)

---

## Prerequisites

- [x] Create a Neon account at https://neon.tech
- [x] Have access to the current Supabase database
- [x] Have access to Vercel deployment settings
- [x] Backup all current data from Supabase

---

## Phase 1: Preparation and Setup

### 1.1 Export Data from Supabase

You'll use `pg_dump` to export each table as a data-only SQL file. This avoids pulling in Supabase-specific schema extras (RLS policies, extensions, sequences owned by Supabase) that would conflict with Neon.

**Get your Supabase connection string:**
1. Log into Supabase dashboard → Project Settings → Database
2. Copy the **URI** connection string (under "Connection string" → "URI" tab)
3. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

Set it as a shell variable to avoid retyping:
```bash
export SUPABASE_DB="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Export each table (data only, no schema, no ownership):**
```bash
# Export recipes first (brews has a foreign key to recipes)
pg_dump "$SUPABASE_DB" \
  --table=recipes \
  --data-only \
  --no-owner \
  --no-acl \
  --no-privileges \
  -f recipes_backup.sql

# Export brews
pg_dump "$SUPABASE_DB" \
  --table=brews \
  --data-only \
  --no-owner \
  --no-acl \
  --no-privileges \
  -f brews_backup.sql

# Export reviews
pg_dump "$SUPABASE_DB" \
  --table=reviews \
  --data-only \
  --no-owner \
  --no-acl \
  --no-privileges \
  -f reviews_backup.sql
```

**Verify the exports look correct:**
```bash
# Check row counts in each file (COPY lines show actual data)
grep -c "^[0-9]" recipes_backup.sql || grep "COPY" recipes_backup.sql
grep -c "^[0-9]" brews_backup.sql   || grep "COPY" brews_backup.sql
grep -c "^[0-9]" reviews_backup.sql || grep "COPY" reviews_backup.sql
```

- [x] `recipes_backup.sql` created and non-empty
- [x] `brews_backup.sql` created and non-empty
- [x] `reviews_backup.sql` created and non-empty
- [x] Save all exports to a secure local folder (do not commit to git)

> **Note:** Supabase project was unavailable. Data was recovered from a local cluster backup at `src/db/backups/supabase/db_cluster-08-07-2025@14-22-29.backup`. Individual table COPY blocks were extracted into `src/db/backups/supabase/recipes_data.sql`, `brews_data.sql`, and `reviews_data.sql`.

### 1.2 Create Neon Database
- [x] Log into Neon dashboard
- [x] Create a new project named "tappr" (eu-west-2 region)
- [x] Select the closest region to your users
- [x] Note the connection string (starts with `postgresql://`)
- [x] Save the connection details securely (do not commit to git)

### 1.3 Install Required Dependencies
- [x] Run: `npm install @neondatabase/serverless`
- [x] Run: `npm uninstall @supabase/supabase-js`
- [x] Verify installation: `npm list @neondatabase/serverless` → `@neondatabase/serverless@1.0.2`

---

## Phase 2: Database Schema Migration

### 2.1 Create Database Tables in Neon
- [x] Open Neon SQL Editor in the dashboard
- [x] Run the migration script from `src/db/migrations/create_recipes_table.sql`
- [x] Create the `brews` table with the following schema:
  ```sql
  CREATE TABLE brews (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    style TEXT NOT NULL,
    abv REAL NOT NULL,
    ibu DOUBLE PRECISION,
    description TEXT,
    brew_date TEXT NOT NULL,
    keg_level INTEGER NOT NULL DEFAULT 100,
    api_brew_uuid TEXT NOT NULL UNIQUE,
    brew_uuid TEXT NOT NULL,
    recipe_id TEXT REFERENCES recipes(recipe_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```
- [x] Create the `reviews` table with the following schema:
  ```sql
  CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    review_id TEXT NOT NULL UNIQUE,
    api_brew_uuid TEXT NOT NULL,
    brew_uuid TEXT,
    reviewer_id TEXT,
    reviewer_name TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    review_date TEXT NOT NULL,
    review_type TEXT NOT NULL,
    quick_review JSONB NOT NULL,
    standard_review JSONB,
    expert_review JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ```

### 2.2 Create Database Indexes
- [x] Create index on `brews.api_brew_uuid`: `CREATE INDEX idx_brews_api_brew_uuid ON brews(api_brew_uuid);`
- [x] Create index on `brews.brew_uuid`: `CREATE INDEX idx_brews_brew_uuid ON brews(brew_uuid);`
- [x] Create index on `brews.recipe_id`: `CREATE INDEX idx_brews_recipe_id ON brews(recipe_id);`
- [x] Create index on `recipes.recipe_id`: `CREATE INDEX idx_recipes_recipe_id ON recipes(recipe_id);`
- [x] Create index on `recipes.normalized_name`: `CREATE INDEX idx_recipes_normalized_name ON recipes(normalized_name);`
- [x] Create index on `recipes.normalized_author`: `CREATE INDEX idx_recipes_normalized_author ON recipes(normalized_author);`
- [x] Create index on `recipes.platform`: `CREATE INDEX idx_recipes_platform ON recipes(platform);`
- [x] Create index on `recipes.style`: `CREATE INDEX idx_recipes_style ON recipes(style);`
- [x] Create index on `reviews.review_id`: `CREATE INDEX idx_reviews_review_id ON reviews(review_id);`
- [x] Create index on `reviews.api_brew_uuid`: `CREATE INDEX idx_reviews_api_brew_uuid ON reviews(api_brew_uuid);`
- [x] Create index on `reviews.brew_uuid`: `CREATE INDEX idx_reviews_brew_uuid ON reviews(brew_uuid);`

### 2.3 Import Data to Neon

**Get your Neon connection string:**
1. Log into Neon dashboard → your project → Dashboard
2. Click **Connect** and copy the connection string
3. It looks like: `postgresql://[user]:[password]@[host].neon.tech/[dbname]?sslmode=require`

Set it as a shell variable:
```bash
export NEON_DB="postgresql://[user]:[password]@[host].neon.tech/[dbname]?sslmode=require"
```

**Import in order — recipes must come first** (brews has a foreign key to `recipes.recipe_id`):

```bash
# 1. Import recipes
psql "$NEON_DB" -f recipes_backup.sql

# 2. Import brews
psql "$NEON_DB" -f brews_backup.sql

# 3. Import reviews
psql "$NEON_DB" -f reviews_backup.sql
```

**Reset sequences after import** so that new inserts don't collide with the imported IDs (the `id SERIAL` columns use sequences that need to be advanced past the highest imported value):

```sql
-- Run these in the Neon SQL Editor or via psql
SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes));
SELECT setval('brews_id_seq',   (SELECT MAX(id) FROM brews));
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
```

**Verify record counts match Supabase:**
```bash
psql "$NEON_DB" -c "SELECT COUNT(*) AS recipes FROM recipes;"
psql "$NEON_DB" -c "SELECT COUNT(*) AS brews   FROM brews;"
psql "$NEON_DB" -c "SELECT COUNT(*) AS reviews FROM reviews;"
```

Cross-check these against your Supabase counts:
```bash
psql "$SUPABASE_DB" -c "SELECT COUNT(*) AS recipes FROM recipes;"
psql "$SUPABASE_DB" -c "SELECT COUNT(*) AS brews   FROM brews;"
psql "$SUPABASE_DB" -c "SELECT COUNT(*) AS reviews FROM reviews;"
```

**Verify foreign key relationships are intact:**
```bash
psql "$NEON_DB" -c "SELECT COUNT(*) FROM brews WHERE recipe_id IS NOT NULL;"
psql "$NEON_DB" -c "SELECT COUNT(*) FROM brews b LEFT JOIN recipes r ON b.recipe_id = r.recipe_id WHERE b.recipe_id IS NOT NULL AND r.recipe_id IS NULL;"
# ↑ Should return 0 (no orphaned brews)
```

- [x] All record counts match Supabase (1 recipe, 10 brews, 26 reviews)
- [x] Sequences reset (recipes → 3, brews → 34, reviews → 35)
- [x] Zero orphaned foreign key references

---

## Phase 3: Code Migration

### 3.1 Update Environment Variables
- [x] Add to `.env.local`: `DATABASE_URL=<your-neon-connection-string>`
- [x] Add to Vercel environment variables: `DATABASE_URL` (production value)
- [x] Remove: `NEXT_PUBLIC_SUPABASE_URL`
- [x] Remove: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.2 Create Neon Database Client

Create **`src/lib/neon.ts`** (replaces `src/lib/supabase.ts`):

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default sql;
```

Update **`src/lib/db/index.ts`**:

```typescript
import sql from '../neon';

export default sql;

export function getDb() {
  return sql;
}
```

Delete `src/lib/supabase.ts`.

### 3.3 Update Database Service Files

All services switch from Supabase's `{ data, error }` pattern to `try/catch` with `result.rows`.

**Query pattern reference:**

| Supabase | Neon |
|---|---|
| `.from('t').select('*').order('id')` | `` sql`SELECT * FROM t ORDER BY id` `` → `.rows` |
| `.select('*').eq('col', val).single()` | `` sql`SELECT * FROM t WHERE col = ${val}` `` → `.rows[0] \|\| null` |
| `.insert([obj]).select().single()` | `` sql`INSERT INTO t (...) VALUES (...) RETURNING *` `` → `.rows[0]` |
| `.update(obj).eq('col', val).select().single()` | `` sql`UPDATE t SET ... WHERE col = ${val} RETURNING *` `` → `.rows[0]` |
| `.delete().eq('col', val)` | `` sql`DELETE FROM t WHERE col = ${val}` `` |
| `.select('*').in('col', arr)` | `` sql`SELECT * FROM t WHERE col = ANY(${arr})` `` |
| `.ilike('col', '%val%')` | `` sql`WHERE col ILIKE ${'%' + val + '%'}` `` |

---

#### `src/lib/db/beer-service.ts`

Replace the Supabase import with `import sql from '@/lib/neon';` and convert each function:

```typescript
// getAllBrews
export async function getAllBrews(): Promise<BrewDB[]> {
  try {
    const result = await sql`SELECT * FROM brews ORDER BY id`;
    return result.rows as BrewDB[];
  } catch (error) {
    console.error('Error fetching brews:', error);
    return [];
  }
}

// getBrewById
export async function getBrewById(id: number): Promise<BrewDB | null> {
  try {
    const result = await sql`SELECT * FROM brews WHERE id = ${id}`;
    return (result.rows[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error fetching brew with ID ${id}:`, error);
    return null;
  }
}

// getBrewByBrewUuid
export async function getBrewByBrewUuid(brewUuid: string): Promise<BrewDB | null> {
  try {
    const result = await sql`SELECT * FROM brews WHERE brew_uuid = ${brewUuid}`;
    return (result.rows[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error fetching brew with brew_uuid ${brewUuid}:`, error);
    return null;
  }
}

// getBrewByApiBrewUuid
export async function getBrewByApiBrewUuid(apiBrewUuid: string): Promise<BrewDB | null> {
  try {
    const result = await sql`SELECT * FROM brews WHERE api_brew_uuid = ${apiBrewUuid}`;
    return (result.rows[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error fetching brew with api_brew_uuid ${apiBrewUuid}:`, error);
    return null;
  }
}

// createBrew
export async function createBrew(data: BrewCreateInput): Promise<BrewDB | null> {
  const newBrew = {
    name: data.name,
    style: data.style,
    abv: data.abv,
    ibu: data.ibu ?? null,
    description: data.description ?? null,
    brew_date: data.brewDate || new Date().toISOString().split('T')[0],
    keg_level: data.kegLevel ?? 100,
    brew_uuid: data.brewUuid || uuidv4(),
    api_brew_uuid: uuidv4(),
    recipe_id: data.recipeId ?? null,
  };

  try {
    const result = await sql`
      INSERT INTO brews (name, style, abv, ibu, description, brew_date, keg_level, brew_uuid, api_brew_uuid, recipe_id)
      VALUES (${newBrew.name}, ${newBrew.style}, ${newBrew.abv}, ${newBrew.ibu},
              ${newBrew.description}, ${newBrew.brew_date}, ${newBrew.keg_level},
              ${newBrew.brew_uuid}, ${newBrew.api_brew_uuid}, ${newBrew.recipe_id})
      RETURNING *
    `;
    return result.rows[0] as BrewDB;
  } catch (error) {
    console.error('Error creating brew:', error);
    return null;
  }
}

// updateBrew — merge existing with provided fields, then do a full UPDATE
export async function updateBrew(id: number, data: Partial<BrewCreateInput>): Promise<BrewDB | null> {
  const existingBrew = await getBrewById(id);
  if (!existingBrew) return null;

  const name        = data.name        ?? existingBrew.name;
  const style       = data.style       ?? existingBrew.style;
  const abv         = data.abv         ?? existingBrew.abv;
  const ibu         = data.ibu         ?? existingBrew.ibu ?? null;
  const description = data.description ?? existingBrew.description ?? null;
  const brew_date   = data.brewDate    ?? existingBrew.brew_date;
  const keg_level   = data.kegLevel    ?? existingBrew.keg_level;
  const recipe_id   = data.recipeId    ?? existingBrew.recipe_id ?? null;

  try {
    const result = await sql`
      UPDATE brews
      SET name = ${name}, style = ${style}, abv = ${abv}, ibu = ${ibu},
          description = ${description}, brew_date = ${brew_date}, keg_level = ${keg_level},
          recipe_id = ${recipe_id}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return (result.rows[0] as BrewDB) || null;
  } catch (error) {
    console.error(`Error updating brew with ID ${id}:`, error);
    return null;
  }
}

// deleteBrew
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
```

---

#### `src/lib/db/recipe-service.ts`

Replace the Supabase import with `import sql from '@/lib/neon';` and convert each function:

```typescript
// getAllRecipes
export async function getAllRecipes(): Promise<RecipeDB[]> {
  try {
    const result = await sql`SELECT * FROM recipes ORDER BY name`;
    return result.rows as RecipeDB[];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// getRecipeById
export async function getRecipeById(id: number): Promise<RecipeDB | null> {
  try {
    const result = await sql`SELECT * FROM recipes WHERE id = ${id}`;
    return (result.rows[0] as RecipeDB) || null;
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    return null;
  }
}

// getRecipeByRecipeId
export async function getRecipeByRecipeId(recipeId: string): Promise<RecipeDB | null> {
  try {
    const result = await sql`SELECT * FROM recipes WHERE recipe_id = ${recipeId}`;
    return (result.rows[0] as RecipeDB) || null;
  } catch (error) {
    console.error(`Error fetching recipe with recipe_id ${recipeId}:`, error);
    return null;
  }
}

// searchRecipes — uses nullable parameter guards to handle optional filters
export async function searchRecipes(
  name?: string,
  author?: string,
  platform?: string,
  style?: string
): Promise<RecipeDB[]> {
  const namePat   = name   ? '%' + normalizeString(name) + '%'   : null;
  const authorPat = author ? '%' + normalizeString(author) + '%' : null;
  const stylePat  = style  ? '%' + style + '%'                   : null;

  try {
    const result = await sql`
      SELECT * FROM recipes
      WHERE (${namePat}   IS NULL OR normalized_name   ILIKE ${namePat})
        AND (${authorPat} IS NULL OR normalized_author ILIKE ${authorPat})
        AND (${platform ?? null}  IS NULL OR platform = ${platform ?? null})
        AND (${stylePat}  IS NULL OR style ILIKE ${stylePat})
      ORDER BY name
    `;
    return result.rows as RecipeDB[];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
}

// createRecipe
export async function createRecipe(data: RecipeCreateInput): Promise<RecipeDB | null> {
  const normalizedName   = normalizeString(data.name);
  const normalizedAuthor = normalizeString(data.author);
  const recipeId         = generateRecipeId(data.platform, data.author, data.name);

  try {
    const result = await sql`
      INSERT INTO recipes (recipe_id, name, normalized_name, author, normalized_author, platform, description, style)
      VALUES (${recipeId}, ${data.name}, ${normalizedName}, ${data.author}, ${normalizedAuthor},
              ${data.platform}, ${data.description ?? null}, ${data.style ?? null})
      RETURNING *
    `;
    return result.rows[0] as RecipeDB;
  } catch (error) {
    console.error('Error creating recipe:', error);
    return null;
  }
}

// updateRecipe — merge existing with provided fields
export async function updateRecipe(id: number, data: Partial<RecipeCreateInput>): Promise<RecipeDB | null> {
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) return null;

  const name     = data.name     ?? existingRecipe.name;
  const author   = data.author   ?? existingRecipe.author;
  const platform = data.platform ?? existingRecipe.platform;

  const normalizedName   = normalizeString(name);
  const normalizedAuthor = normalizeString(author);
  const recipeId         = generateRecipeId(platform, author, name);
  const description      = data.description ?? existingRecipe.description ?? null;
  const style            = data.style       ?? existingRecipe.style       ?? null;

  try {
    const result = await sql`
      UPDATE recipes
      SET recipe_id = ${recipeId}, name = ${name}, normalized_name = ${normalizedName},
          author = ${author}, normalized_author = ${normalizedAuthor},
          platform = ${platform}, description = ${description}, style = ${style},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return (result.rows[0] as RecipeDB) || null;
  } catch (error) {
    console.error(`Error updating recipe with ID ${id}:`, error);
    return null;
  }
}

// deleteRecipe
export async function deleteRecipe(id: number): Promise<boolean> {
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) return false;

  try {
    await sql`DELETE FROM recipes WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error(`Error deleting recipe with ID ${id}:`, error);
    return false;
  }
}
```

---

#### `src/lib/db/review-service.ts`

Replace the Supabase import with `import sql from '@/lib/neon';` and convert each function.

**Important:** JSONB fields (`quick_review`, `standard_review`, `expert_review`) must use `JSON.stringify()` on insert/update. Neon returns JSONB columns as already-parsed JS objects on read — no `JSON.parse` needed.

```typescript
// getAllReviews
export async function getAllReviews(): Promise<Review[]> {
  try {
    const result = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
    return result.rows as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// getReviewById
export async function getReviewById(reviewId: string): Promise<Review | null> {
  try {
    const result = await sql`SELECT * FROM reviews WHERE review_id = ${reviewId}`;
    return (result.rows[0] as Review) || null;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewId}:`, error);
    return null;
  }
}

// getReviewsByApiBrewUuid
export async function getReviewsByApiBrewUuid(apiBrewUuid: string): Promise<Review[]> {
  try {
    const result = await sql`
      SELECT * FROM reviews WHERE api_brew_uuid = ${apiBrewUuid} ORDER BY created_at DESC
    `;
    return result.rows as Review[];
  } catch (error) {
    console.error(`Error fetching reviews for API brew UUID ${apiBrewUuid}:`, error);
    return [];
  }
}

// getReviewsByBrewUuid
export async function getReviewsByBrewUuid(brewUuid: string): Promise<Review[]> {
  try {
    const result = await sql`
      SELECT * FROM reviews WHERE brew_uuid = ${brewUuid} ORDER BY created_at DESC
    `;
    return result.rows as Review[];
  } catch (error) {
    console.error(`Error fetching reviews for brew UUID ${brewUuid}:`, error);
    return [];
  }
}

// createReview — JSONB fields must be JSON.stringify'd
export async function createReview(data: ReviewCreateInput): Promise<Review | null> {
  const newReview = {
    review_id:       uuidv4(),
    api_brew_uuid:   data.apiBrewUuid,
    brew_uuid:       data.brewUuid        ?? null,
    reviewer_id:     data.reviewerId      ?? null,
    reviewer_name:   data.reviewerName    ?? null,
    is_anonymous:    data.isAnonymous     ?? false,
    review_date:     new Date().toISOString(),
    review_type:     data.reviewType,
    quick_review:    JSON.stringify(data.quickReview),
    standard_review: data.standardReview ? JSON.stringify(data.standardReview) : null,
    expert_review:   data.expertReview   ? JSON.stringify(data.expertReview)   : null,
  };

  try {
    const result = await sql`
      INSERT INTO reviews
        (review_id, api_brew_uuid, brew_uuid, reviewer_id, reviewer_name,
         is_anonymous, review_date, review_type, quick_review, standard_review, expert_review)
      VALUES
        (${newReview.review_id}, ${newReview.api_brew_uuid}, ${newReview.brew_uuid},
         ${newReview.reviewer_id}, ${newReview.reviewer_name}, ${newReview.is_anonymous},
         ${newReview.review_date}, ${newReview.review_type},
         ${newReview.quick_review}, ${newReview.standard_review}, ${newReview.expert_review})
      RETURNING *
    `;
    return result.rows[0] as Review;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
}

// updateReview — stringify JSONB fields if provided
export async function updateReview(reviewId: string, data: Partial<ReviewCreateInput>): Promise<Review | null> {
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) return null;

  const reviewer_id     = data.reviewerId   !== undefined ? data.reviewerId   : existingReview.reviewer_id;
  const reviewer_name   = data.reviewerName !== undefined ? data.reviewerName : existingReview.reviewer_name;
  const is_anonymous    = data.isAnonymous  !== undefined ? data.isAnonymous  : existingReview.is_anonymous;
  const review_type     = data.reviewType   !== undefined ? data.reviewType   : existingReview.review_type;
  const quick_review    = data.quickReview    !== undefined ? JSON.stringify(data.quickReview)    : JSON.stringify(existingReview.quick_review);
  const standard_review = data.standardReview !== undefined ? JSON.stringify(data.standardReview) : (existingReview.standard_review ? JSON.stringify(existingReview.standard_review) : null);
  const expert_review   = data.expertReview   !== undefined ? JSON.stringify(data.expertReview)   : (existingReview.expert_review   ? JSON.stringify(existingReview.expert_review)   : null);

  try {
    const result = await sql`
      UPDATE reviews
      SET reviewer_id = ${reviewer_id}, reviewer_name = ${reviewer_name},
          is_anonymous = ${is_anonymous}, review_type = ${review_type},
          quick_review = ${quick_review}, standard_review = ${standard_review},
          expert_review = ${expert_review}, updated_at = NOW()
      WHERE review_id = ${reviewId}
      RETURNING *
    `;
    return (result.rows[0] as Review) || null;
  } catch (error) {
    console.error(`Error updating review with ID ${reviewId}:`, error);
    return null;
  }
}

// deleteReview
export async function deleteReview(reviewId: string): Promise<boolean> {
  const existingReview = await getReviewById(reviewId);
  if (!existingReview) return false;

  try {
    await sql`DELETE FROM reviews WHERE review_id = ${reviewId}`;
    return true;
  } catch (error) {
    console.error(`Error deleting review with ID ${reviewId}:`, error);
    return false;
  }
}
```

---

### 3.4 Update API Routes That Import Supabase Directly

Three API routes bypass the service layer and use Supabase directly. Update each to use the Neon client.

Change the import in each file from:
```typescript
import supabase from '@/lib/supabase';
```
to:
```typescript
import sql from '@/lib/neon';
```

---

**`src/app/api/recipes/recipe-id/[recipeId]/brews/route.ts`**

```typescript
const result = await sql`
  SELECT * FROM brews WHERE recipe_id = ${recipeId} ORDER BY created_at DESC
`;
const data = result.rows;
if (!data || data.length === 0) {
  return NextResponse.json([]);
}
```

---

**`src/app/api/brews/api/[apiBrewUuid]/link-recipe/route.ts`**

```typescript
const result = await sql`
  UPDATE brews
  SET recipe_id = ${body.recipeId}, updated_at = NOW()
  WHERE api_brew_uuid = ${apiBrewUuid}
  RETURNING *
`;
const updatedBrew = result.rows[0];
if (!updatedBrew) {
  return NextResponse.json({ error: 'Failed to link brew to recipe' }, { status: 500 });
}
```

Error handling changes from `if (error) { ... }` to `try/catch` wrapping the `await sql` call.

---

**`src/app/api/recipes/recipe-id/[recipeId]/reviews/route.ts`**

The `.in()` operator becomes `ANY()` with a JS array:

```typescript
const brewsResult = await sql`SELECT * FROM brews WHERE recipe_id = ${recipeId}`;
const brews = brewsResult.rows;

if (!brews || brews.length === 0) {
  return NextResponse.json([]);
}

const apiBrewUuids = brews.map((b: { api_brew_uuid: string }) => b.api_brew_uuid);

const reviewsResult = await sql`
  SELECT * FROM reviews WHERE api_brew_uuid = ANY(${apiBrewUuids})
`;
const reviews = reviewsResult.rows;
```

Neon's tagged template handles JS arrays natively with `ANY(${array})` — no manual formatting needed.

---

## Phase 4: Testing

### 4.1 Local Testing
- [x] Start local development server: `npm run dev`
- [x] Test GET `/api/beers` endpoint (should return all brews)
- [x] Test GET `/api/beers/[id]` endpoint with a valid ID
- [x] Test GET `/api/beers/public/[brewUuid]` endpoint
- [x] Test GET `/api/beers/api/[apiBrewUuid]` endpoint
- [x] Test POST `/api/beers/add` endpoint (create a test brew)
- [x] Test PATCH `/api/beers/[id]/update` endpoint (note: route uses PATCH not PUT)
- [x] Test DELETE `/api/beers/[id]/delete` endpoint
- [x] Verify the test brew appears in the database

### 4.2 Test Recipe Endpoints
- [x] Test GET `/api/recipes` endpoint (should return all recipes)
- [x] Test GET `/api/recipes/[id]` endpoint with a valid ID
- [x] Test GET `/api/recipes/recipe-id/[recipeId]` endpoint
- [x] Test GET `/api/recipes/recipe-id/[recipeId]/brews` endpoint
- [x] Test POST `/api/recipes/add` endpoint (create a test recipe)
- [x] Test PATCH `/api/recipes/[id]/update` endpoint (note: route uses PATCH not PUT)
- [x] Test DELETE `/api/recipes/[id]/delete` endpoint
- [x] Verify recipe ID generation is deterministic (`?findOrCreate=true` returns same recipeId for identical inputs)
- [x] Test linking a brew to a recipe

### 4.3 Test Review Endpoints
- [x] Test GET `/api/reviews` endpoint (should return all reviews)
- [x] Test GET `/api/reviews/[id]` endpoint with a valid ID
- [x] Test GET `/api/reviews/api-brew/[apiBrewUuid]` endpoint
- [x] Test GET `/api/reviews/brew/[brewUuid]` endpoint
- [x] Test POST `/api/reviews/add` endpoint (create a test review)
- [x] Test POST `/api/reviews/public/add` endpoint (note: expects `api_brew_uuid` snake_case, not camelCase)
- [x] Test PATCH `/api/reviews/[id]/update` endpoint
- [x] Test DELETE `/api/reviews/[id]/delete` endpoint
- [x] Verify JSONB fields (quick_review, standard_review, expert_review) work correctly

### 4.4 Test API Authentication
- [x] Test protected endpoints WITHOUT API key (should return 401)
- [x] Test protected endpoints WITH valid API key (should return 200)
- [x] Test protected endpoints WITH invalid API key (should return 401)
- [x] Test public endpoints without API key (should work)

### 4.5 Build and Production Test
- [x] Run production build: `npm run build`
- [x] Verify build completes without errors
- [x] Check for any TypeScript errors
- [x] Check for any linting errors: `npm run lint`
- [x] Test the production build locally: `npm start`

---

## Phase 5: Deployment

### 5.1 Deploy to Vercel
- [x] Commit all code changes to git
- [x] Push to GitHub: `git push origin <branch-name>`
- [x] Verify Vercel auto-deployment starts
- [x] Monitor deployment logs for errors
- [x] Wait for deployment to complete

### 5.2 Verify Production Deployment
- [x] Test production API: `curl https://www.tappr.beer/api/beers -H "X-API-Key: <your-key>"`
- [x] Verify response contains expected data
- [x] Test all critical endpoints in production
- [ ] Check Vercel logs for any database connection errors
- [ ] Verify response times are acceptable (< 1 second)

### 5.3 Monitor for Issues
- [ ] Monitor Vercel logs for 24 hours
- [ ] Check for any database connection errors
- [ ] Check for any query performance issues
- [ ] Verify no data loss occurred
- [ ] Monitor API response times

---

## Phase 6: Cleanup

### 6.1 Remove Supabase Dependencies
- [ ] Verify `@supabase/supabase-js` has been uninstalled from `package.json`
- [ ] Confirm `src/lib/supabase.ts` has been deleted
- [x] Remove Supabase environment variables from `.env.local`
- [x] Remove Supabase environment variables from Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Commit cleanup changes

### 6.2 Update Documentation
- [ ] Update `CLAUDE.md` to reference Neon instead of Supabase
- [ ] Update `docs/api/README.md` to reference Neon instead of Supabase
- [ ] Update any other documentation that mentions Supabase
- [ ] Add migration completion date to this checklist

### 6.3 Decommission Supabase
- [ ] Export final backup from Supabase (for archival purposes)
- [ ] Download all Supabase logs
- [ ] Pause or delete Supabase project (optional, can keep as backup)

---

## Rollback Plan (If Issues Occur)

### Emergency Rollback Steps
- [ ] Revert code changes in git: `git revert <commit-hash>`
- [ ] Push rollback to GitHub: `git push origin <branch-name>`
- [ ] Restore Supabase environment variables in Vercel
- [ ] Verify Supabase connection is working
- [ ] Monitor for stability
- [ ] Document what went wrong
- [ ] Plan fixes before attempting migration again

---

## Key Differences: Supabase vs Neon

### Supabase Query Syntax
```typescript
const { data, error } = await supabase
  .from('brews')
  .select('*')
  .eq('id', id)
  .single();
if (error) { ... }
```

### Neon Query Syntax (`@neondatabase/serverless`)
```typescript
try {
  const result = await sql`SELECT * FROM brews WHERE id = ${id}`;
  const data = result.rows[0] || null;
} catch (error) { ... }
```

### Important Notes
- Neon uses raw SQL with tagged template literals instead of Supabase's query builder
- Error handling uses `try/catch` instead of `{ data, error }` destructuring
- `result.rows` is always an array; use `result.rows[0]` for single-row queries
- JSONB fields require `JSON.stringify()` on write; Neon returns them as parsed objects on read
- JS arrays work natively with `ANY(${array})` for `IN`-style queries
- `updated_at = NOW()` replaces manually setting `updated_at: new Date().toISOString()`

---

## Success Criteria

✅ **Migration is successful when:**
- [ ] All API endpoints return correct data
- [ ] No data loss occurred (record counts match)
- [ ] All tests pass in production
- [ ] API response times are acceptable
- [ ] No errors in Vercel logs for 24 hours
- [ ] Mobile app can connect and function normally
- [ ] All CRUD operations work correctly
- [ ] Foreign key relationships are intact
- [ ] Indexes are improving query performance

---

**Migration Completed Date**: _________________

**Completed By**: _________________

**Deviations from Plan**: _________________

**Notes**: _________________
