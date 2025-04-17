import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import BeerDetails from '@/components/BeerDetails';
import { getBrewByApiBrewUuid } from '@/lib/db/beer-service';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Review Submitted - TAPPr',
  description: 'Thank you for submitting your review',
};

// Define the props for the page component
interface ReviewConfirmationPageProps {
  params: {
    brewUuid: string; // This is actually the api_brew_uuid in the URL (for backward compatibility)
  };
}

// Server component to fetch the beer data
export default async function ReviewConfirmationPage({ params }: ReviewConfirmationPageProps) {
  // Await params to ensure it's fully resolved
  const resolvedParams = await params;
  const { brewUuid: apiBrewUuid } = resolvedParams; // This is actually the api_brew_uuid
  const beer = await getBrewByApiBrewUuid(apiBrewUuid);

  if (!beer) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center font-patua text-amber-600">Thank You!</h1>
        <div className="text-center mb-8">
          <p className="text-xl mb-2 font-montserrat">Your review has been submitted successfully.</p>
          <p className="text-gray-600 font-montserrat">We appreciate your feedback on this brew!</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-patua">Beer Details</h2>
          <BeerDetails beer={beer} />
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/"
            className="bg-amber-600 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition duration-200 font-montserrat"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
