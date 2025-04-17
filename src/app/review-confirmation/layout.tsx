import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Confirmation - TAPPr',
  description: 'Thank you for submitting your review',
};

export default function ReviewConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {children}
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
