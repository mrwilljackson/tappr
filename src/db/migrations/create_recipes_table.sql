-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  recipe_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  author TEXT NOT NULL,
  normalized_author TEXT NOT NULL,
  platform TEXT NOT NULL,
  description TEXT,
  style TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_recipes_recipe_id ON recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipes_normalized_name ON recipes(normalized_name);
CREATE INDEX IF NOT EXISTS idx_recipes_normalized_author ON recipes(normalized_author);
CREATE INDEX IF NOT EXISTS idx_recipes_platform ON recipes(platform);
CREATE INDEX IF NOT EXISTS idx_recipes_style ON recipes(style);

-- Add recipe_id column to brews table if it doesn't exist
ALTER TABLE brews ADD COLUMN IF NOT EXISTS recipe_id TEXT REFERENCES recipes(recipe_id) ON DELETE SET NULL;

-- Create index for recipe_id in brews table
CREATE INDEX IF NOT EXISTS idx_brews_recipe_id ON brews(recipe_id);
