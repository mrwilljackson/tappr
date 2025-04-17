'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Beer } from '@/types/beer';

export default function ReviewTestPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBeers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/beers', {
          headers: {
            'X-API-Key': 'tappr_api_key_12345'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch beers');
        }

        const data = await response.json();
        setBeers(data);
      } catch (err: Error | unknown) {
        console.error('Error fetching beers:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load beers';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBeers();
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 font-patua">Review Test Page</h1>
        <p className="mb-6 font-montserrat">
          This page allows you to test the review functionality. Select a beer to review:
        </p>

        {isLoading && (
          <div className="text-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
            <p className="mt-2 font-montserrat">Loading beers...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beers.map((beer) => (
              <div key={beer.id} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2 font-patua">{beer.name}</h2>
                <p className="text-gray-600 mb-2 font-montserrat">{beer.style}</p>
                <p className="text-gray-600 mb-4 font-montserrat">ABV: {beer.abv}%</p>
                <Link
                  href={`/review/${beer.api_brew_uuid}`}
                  className="inline-block bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 font-montserrat"
                >
                  Review this beer
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-amber-600 hover:text-amber-800 font-montserrat"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
