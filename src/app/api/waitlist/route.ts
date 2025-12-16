import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import axios from 'axios';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// The email address to send waitlist notifications to
// Now that the domain is verified, we can use the environment variable
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'tappr.beer@protonmail.com';

// reCAPTCHA secret key
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

/**
 * Verify the reCAPTCHA token with Google's API
 *
 * @param token The reCAPTCHA token to verify
 * @returns A boolean indicating whether the token is valid
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );

    return response.data.success === true;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, captchaToken } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate reCAPTCHA token
    if (!captchaToken) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification is required' },
        { status: 400 }
      );
    }

    // Verify the reCAPTCHA token
    const isValidCaptcha = await verifyRecaptcha(captchaToken);
    if (!isValidCaptcha) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Send email notification using Resend
    try {
      const { error } = await resend.emails.send({
      from: 'TAPPr Waitlist <waitlist@tappr.beer>',
      to: [NOTIFICATION_EMAIL],
      subject: 'New TAPPr Waitlist Signup',
      html: `
        <h1>New Waitlist Signup</h1>
        <p>Someone has joined the TAPPr waitlist:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr />
        <p>This is an automated message from your TAPPr website.</p>
      `,
    });

      if (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to join waitlist. Please try again later.' },
          { status: 500 }
        );
      }
    } catch (sendError) {
      console.error('Exception sending email:', sendError);
      return NextResponse.json(
        { success: false, message: 'Failed to join waitlist. Please try again later.' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for joining our waitlist!'
    });
  } catch (error) {
    console.error('Error processing waitlist request:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
