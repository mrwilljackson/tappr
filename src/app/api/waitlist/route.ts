import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Debug environment variables
console.log('Environment variables:');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set (length: ' + process.env.RESEND_API_KEY.length + ')' : 'Not set');
console.log('- NOTIFICATION_EMAIL:', process.env.NOTIFICATION_EMAIL || 'Not set');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// The email address to send waitlist notifications to
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'mrwilljackson@gmail.com';

// Log the actual email being used
console.log('Using notification email:', NOTIFICATION_EMAIL);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email } = body;

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

    // Send email notification using Resend
    try {
      const { data, error } = await resend.emails.send({
      from: 'TAPPr Waitlist <onboarding@resend.dev>',
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
