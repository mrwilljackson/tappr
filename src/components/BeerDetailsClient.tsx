'use client';

import React, { useEffect, useState } from 'react';
import { Beer } from '@/types/beer';
import BeerDetails from './BeerDetails';

interface BeerDetailsClientProps {
  brewUuid: string;
}

const BeerDetailsClient: React.FC<BeerDetailsClientProps> = ({ brewUuid }) => {
  const [beer, setBeer] = useState<Beer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBeer() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/beers/public/${brewUuid}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch beer: ${response.statusText}`);
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
  }, [brewUuid]);

  return <BeerDetails beer={beer as Beer} isLoading={isLoading} error={error || undefined} />;
};

export default BeerDetailsClient;
