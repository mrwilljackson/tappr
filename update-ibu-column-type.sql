-- SQL script to update the IBU column type in the beers table
-- Run this in the Supabase SQL editor

-- First, check the current column type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'beers' AND column_name = 'ibu';

-- Update the column type to double precision (float8)
ALTER TABLE beers 
ALTER COLUMN ibu TYPE double precision USING ibu::double precision;

-- Verify the column type has been updated
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'beers' AND column_name = 'ibu';
