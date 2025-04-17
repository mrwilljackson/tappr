'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReCAPTCHA from 'react-google-recaptcha';

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

  // Reference to the reCAPTCHA component
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Handle reCAPTCHA change
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    // Check if reCAPTCHA is completed
    if (!captchaToken) {
      setStatus({
        message: 'Please complete the reCAPTCHA verification.',
        success: false,
        isSubmitting: false,
      });
      return;
    }

    setStatus({
      message: 'Submitting...',
      success: false,
      isSubmitting: true,
    });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          captchaToken
        })
      });

      const data = await response.json();

      setStatus({
        message: data.message,
        success: data.success,
        isSubmitting: false,
      });

      if (data.success) {
        setEmail('');
        // Reset the reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaToken(null);
        }
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
    <div className="w-full max-w-sm space-y-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 sm:flex-row">
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
        </div>

        <div className="flex justify-center mt-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
            onChange={handleCaptchaChange}
            theme="light"
            size="normal"
          />
        </div>
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
