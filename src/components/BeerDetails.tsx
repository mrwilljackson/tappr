import React from 'react';
import { Beer } from '@/types/beer';

interface BeerDetailsProps {
  beer: Beer;
  isLoading?: boolean;
  error?: string;
}

const BeerDetails: React.FC<BeerDetailsProps> = ({ beer, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
        <h2 className="text-xl font-bold text-red-700 mb-2 font-patua">Error Loading Beer</h2>
        <p className="text-red-600 font-montserrat">{error}</p>
      </div>
    );
  }

  if (!beer) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-700 mb-2 font-patua">Beer Not Found</h2>
        <p className="text-yellow-600 font-montserrat">The requested beer could not be found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2 font-patua">{beer.name}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-montserrat">
          {beer.style}
        </span>
        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-montserrat">
          ABV: {beer.abv}%
        </span>
        {beer.ibu && (
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-montserrat">
            IBU: {beer.ibu}
          </span>
        )}
      </div>
      
      {beer.description && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 font-patua">Description</h2>
          <p className="text-gray-700 font-montserrat">{beer.description}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 font-montserrat">
        <div>Brewed on: {new Date(beer.brewDate).toLocaleDateString()}</div>
        <div className="flex items-center">
          <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className="bg-amber-600 h-2.5 rounded-full" 
              style={{ width: `${beer.kegLevel}%` }}
            ></div>
          </div>
          <span>Keg: {beer.kegLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default BeerDetails;
