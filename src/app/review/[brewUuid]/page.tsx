'use client';

import React from 'react';
import BeerDetailsClient from '@/components/BeerDetailsClient';
import ReviewForm from '@/components/ReviewForm';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ReviewPage() {
  // Get api_brew_uuid from params (still named brewUuid in the URL for backward compatibility)
  const params = useParams();
  const apiBrewUuid = params.brewUuid as string;

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold font-patua">TAPPr</Link>
            <div className="text-sm font-montserrat">Rate Your Beer Experience</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 font-patua">Submit a Review</h1>

          <div className="mb-8">
            <BeerDetailsClient apiBrewUuid={apiBrewUuid} />
          </div>

          <ReviewForm apiBrewUuid={apiBrewUuid} />
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="font-montserrat">&copy; {new Date().getFullYear()} TAPPr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
