'use client';

import React, { useEffect, useState } from 'react';
import { Beer } from '@/types/beer';
import BeerDetails from './BeerDetails';

interface BeerDetailsClientProps {
  apiBrewUuid: string;
  brewUuid?: string; // For backward compatibility
}

const BeerDetailsClient: React.FC<BeerDetailsClientProps> = ({ apiBrewUuid, brewUuid }) => {
  const [beer, setBeer] = useState<Beer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBeer() {
      try {
        setIsLoading(true);
        setError(null);

        // Use the public API brew UUID endpoint
        const response = await fetch(`/api/beers/public/api/${apiBrewUuid}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch brew: ${response.statusText}`);
        }

        const data = await response.json();
        setBeer(data);
      } catch (err: Error | unknown) {
        console.error('Error fetching beer:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load beer details';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBeer();
  }, [apiBrewUuid]);

  return <BeerDetails beer={beer as Beer} isLoading={isLoading} error={error || undefined} />;
};

export default BeerDetailsClient;
