# Database Migration: Supabase to Neon PostgreSQL

This checklist provides step-by-step instructions for migrating the TAPPr database from Supabase to Neon PostgreSQL.

## Prerequisites

- [ ] Create a Neon account at https://neon.tech
- [ ] Have access to the current Supabase database
- [ ] Have access to Vercel deployment settings
- [ ] Backup all current data from Supabase

---

## Phase 1: Preparation and Setup

### 1.1 Export Data from Supabase
- [ ] Log into Supabase dashboard
- [ ] Navigate to Database → Backups
- [ ] Export the `brews` table data (CSV or SQL dump)
- [ ] Export the `recipes` table data (CSV or SQL dump)
- [ ] Export the `reviews` table data (CSV or SQL dump)
- [ ] Save all exports to a secure local folder
- [ ] Verify exports contain all expected records

### 1.2 Create Neon Database
- [ ] Log into Neon dashboard
- [ ] Create a new project named "tappr-production"
- [ ] Select the closest region to your users
- [ ] Note the connection string (starts with `postgresql://`)
- [ ] Save the connection details securely (do not commit to git)

### 1.3 Install Required Dependencies
- [ ] Run: `npm install @neondatabase/serverless`
- [ ] Run: `npm install dotenv` (if not already installed)
- [ ] Verify installation: `npm list @neondatabase/serverless`

---

## Phase 2: Database Schema Migration

### 2.1 Create Database Tables in Neon
- [ ] Open Neon SQL Editor in the dashboard
- [ ] Run the migration script from `src/db/migrations/create_recipes_table.sql`
- [ ] Create the `brews` table with the following schema:
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
- [ ] Create the `reviews` table with the following schema:
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
- [ ] Create index on `brews.api_brew_uuid`: `CREATE INDEX idx_brews_api_brew_uuid ON brews(api_brew_uuid);`
- [ ] Create index on `brews.brew_uuid`: `CREATE INDEX idx_brews_brew_uuid ON brews(brew_uuid);`
- [ ] Create index on `brews.recipe_id`: `CREATE INDEX idx_brews_recipe_id ON brews(recipe_id);`
- [ ] Create index on `recipes.recipe_id`: `CREATE INDEX idx_recipes_recipe_id ON recipes(recipe_id);`
- [ ] Create index on `recipes.normalized_name`: `CREATE INDEX idx_recipes_normalized_name ON recipes(normalized_name);`
- [ ] Create index on `recipes.normalized_author`: `CREATE INDEX idx_recipes_normalized_author ON recipes(normalized_author);`
- [ ] Create index on `recipes.platform`: `CREATE INDEX idx_recipes_platform ON recipes(platform);`
- [ ] Create index on `recipes.style`: `CREATE INDEX idx_recipes_style ON recipes(style);`
- [ ] Create index on `reviews.review_id`: `CREATE INDEX idx_reviews_review_id ON reviews(review_id);`
- [ ] Create index on `reviews.api_brew_uuid`: `CREATE INDEX idx_reviews_api_brew_uuid ON reviews(api_brew_uuid);`
- [ ] Create index on `reviews.brew_uuid`: `CREATE INDEX idx_reviews_brew_uuid ON reviews(brew_uuid);`

### 2.3 Import Data to Neon
- [ ] Import `recipes` table data first (due to foreign key constraints)
- [ ] Verify all recipes imported correctly: `SELECT COUNT(*) FROM recipes;`
- [ ] Import `brews` table data
- [ ] Verify all brews imported correctly: `SELECT COUNT(*) FROM brews;`
- [ ] Import `reviews` table data
- [ ] Verify all reviews imported correctly: `SELECT COUNT(*) FROM reviews;`
- [ ] Verify foreign key relationships: `SELECT COUNT(*) FROM brews WHERE recipe_id IS NOT NULL;`

---

## Phase 3: Code Migration

### 3.1 Update Environment Variables
- [ ] Add to `.env.local`: `DATABASE_URL=<your-neon-connection-string>`
- [ ] Add to Vercel environment variables: `DATABASE_URL` (production value)
- [ ] Remove or comment out: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Remove or comment out: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Verify environment variables are set correctly

### 3.2 Create Neon Database Client
- [ ] Create new file: `src/lib/neon.ts`
- [ ] Import Neon serverless driver
- [ ] Create database connection pool
- [ ] Export connection for use in services
- [ ] Test connection with a simple query

### 3.3 Update Database Service Files
- [ ] Update `src/lib/db/beer-service.ts`:
  - [ ] Replace Supabase import with Neon client
  - [ ] Convert `.from('brews').select()` to SQL queries
  - [ ] Convert `.insert()` to SQL INSERT statements
  - [ ] Convert `.update()` to SQL UPDATE statements
  - [ ] Convert `.delete()` to SQL DELETE statements
  - [ ] Update error handling for SQL errors
- [ ] Update `src/lib/db/recipe-service.ts`:
  - [ ] Replace Supabase import with Neon client
  - [ ] Convert all Supabase queries to SQL
  - [ ] Update CRUD operations
  - [ ] Test recipe ID generation still works
- [ ] Update `src/lib/db/review-service.ts`:
  - [ ] Replace Supabase import with Neon client
  - [ ] Convert all Supabase queries to SQL
  - [ ] Update CRUD operations
  - [ ] Handle JSONB fields correctly
- [ ] Update `src/lib/db/index.ts`:
  - [ ] Export Neon client instead of Supabase
  - [ ] Update `getDb()` function
- [ ] Remove or deprecate `src/lib/supabase.ts`

---

## Phase 4: Testing

### 4.1 Local Testing
- [ ] Start local development server: `npm run dev`
- [ ] Test GET `/api/beers` endpoint (should return all brews)
- [ ] Test GET `/api/beers/[id]` endpoint with a valid ID
- [ ] Test GET `/api/beers/public/[brewUuid]` endpoint
- [ ] Test GET `/api/beers/api/[apiBrewUuid]` endpoint
- [ ] Test POST `/api/beers/add` endpoint (create a test brew)
- [ ] Test PUT `/api/beers/[id]/update` endpoint
- [ ] Test DELETE `/api/beers/[id]/delete` endpoint
- [ ] Verify the test brew appears in the database

### 4.2 Test Recipe Endpoints
- [ ] Test GET `/api/recipes` endpoint (should return all recipes)
- [ ] Test GET `/api/recipes/[id]` endpoint with a valid ID
- [ ] Test GET `/api/recipes/recipe-id/[recipeId]` endpoint
- [ ] Test GET `/api/recipes/recipe-id/[recipeId]/brews` endpoint
- [ ] Test POST `/api/recipes/add` endpoint (create a test recipe)
- [ ] Test PUT `/api/recipes/[id]/update` endpoint
- [ ] Test DELETE `/api/recipes/[id]/delete` endpoint
- [ ] Verify recipe ID generation is deterministic
- [ ] Test linking a brew to a recipe

### 4.3 Test Review Endpoints
- [ ] Test GET `/api/reviews` endpoint (should return all reviews)
- [ ] Test GET `/api/reviews/[id]` endpoint with a valid ID
- [ ] Test GET `/api/reviews/api-brew/[apiBrewUuid]` endpoint
- [ ] Test GET `/api/reviews/brew/[brewUuid]` endpoint
- [ ] Test POST `/api/reviews/add` endpoint (create a test review)
- [ ] Test POST `/api/reviews/public/add` endpoint (public review submission)
- [ ] Test PUT `/api/reviews/[id]/update` endpoint
- [ ] Test DELETE `/api/reviews/[id]/delete` endpoint
- [ ] Verify JSONB fields (quick_review, standard_review, expert_review) work correctly

### 4.4 Test API Authentication
- [ ] Test protected endpoints WITHOUT API key (should return 401)
- [ ] Test protected endpoints WITH valid API key (should return 200)
- [ ] Test protected endpoints WITH invalid API key (should return 401)
- [ ] Test public endpoints without API key (should work)

### 4.5 Build and Production Test
- [ ] Run production build: `npm run build`
- [ ] Verify build completes without errors
- [ ] Check for any TypeScript errors
- [ ] Check for any linting errors
- [ ] Test the production build locally: `npm start`

---

## Phase 5: Deployment

### 5.1 Deploy to Vercel
- [ ] Commit all code changes to git
- [ ] Push to GitHub: `git push origin <branch-name>`
- [ ] Verify Vercel auto-deployment starts
- [ ] Monitor deployment logs for errors
- [ ] Wait for deployment to complete

### 5.2 Verify Production Deployment
- [ ] Test production API: `curl https://www.tappr.beer/api/beers -H "X-API-Key: <your-key>"`
- [ ] Verify response contains expected data
- [ ] Test all critical endpoints in production
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
- [ ] Uninstall Supabase package: `npm uninstall @supabase/supabase-js`
- [ ] Remove `src/lib/supabase.ts` file
- [ ] Remove Supabase environment variables from `.env.local`
- [ ] Remove Supabase environment variables from Vercel
- [ ] Update `package.json` to remove Supabase references
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Commit cleanup changes

### 6.2 Update Documentation
- [ ] Update `docs/api/README.md` to reference Neon instead of Supabase
- [ ] Update `docs/api/database-schema.md` with Neon connection details
- [ ] Update any other documentation that mentions Supabase
- [ ] Add migration completion date to this checklist
- [ ] Archive this migration checklist for future reference

### 6.3 Decommission Supabase
- [ ] Export final backup from Supabase (for archival purposes)
- [ ] Download all Supabase logs
- [ ] Pause or delete Supabase project (optional, can keep as backup)
- [ ] Update team documentation about the database change

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
```javascript
const { data, error } = await supabase
  .from('brews')
  .select('*')
  .eq('id', id)
  .single();
```

### Neon Query Syntax (using @neondatabase/serverless)
```javascript
const result = await sql`
  SELECT * FROM brews
  WHERE id = ${id}
  LIMIT 1
`;
const data = result.rows[0];
```

### Important Notes
- Neon uses raw SQL queries instead of Supabase's query builder
- Error handling is different (SQL errors vs Supabase errors)
- Connection pooling is handled differently
- JSONB fields require explicit JSON.stringify/parse
- Timestamps are handled natively by PostgreSQL

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

## Support and Resources

- **Neon Documentation**: https://neon.tech/docs
- **Neon Serverless Driver**: https://github.com/neondatabase/serverless
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Migration Support**: Contact Neon support if issues arise

---

**Migration Completed Date**: _________________

**Completed By**: _________________

**Notes**: _________________

