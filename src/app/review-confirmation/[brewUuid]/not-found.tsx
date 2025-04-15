import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <h1 className="text-3xl font-bold mb-4 text-center font-patua text-red-600">Beer Not Found</h1>
      <div className="text-center mb-8">
        <p className="text-xl mb-2 font-montserrat">Sorry, we couldn't find the beer you're looking for.</p>
        <p className="text-gray-600 font-montserrat">The beer may have been removed or the URL might be incorrect.</p>
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
  );
}
