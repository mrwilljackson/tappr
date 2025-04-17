'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    message: string;
    success: boolean;
    isSubmitting: boolean;
  }>({
    message: '',
    success: false,
    isSubmitting: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus({
      message: 'Submitting...',
      success: false,
      isSubmitting: true,
    });
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      setStatus({
        message: data.message,
        success: data.success,
        isSubmitting: false,
      });
      
      if (data.success) {
        setEmail('');
      }
    } catch (error) {
      setStatus({
        message: 'An error occurred. Please try again.',
        success: false,
        isSubmitting: false,
      });
    }
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <Input
          className="max-w-lg flex-1 bg-white text-black"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          className="bg-white text-amber-600 hover:bg-amber-50"
          disabled={status.isSubmitting}
        >
          Join Waitlist
        </Button>
      </form>
      <p className="text-xs text-amber-100 font-montserrat">
        We respect your privacy. Unsubscribe at any time.
      </p>
      {status.message && (
        <p 
          className={`text-sm font-montserrat ${
            status.success ? 'text-green-100' : 'text-red-100'
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
