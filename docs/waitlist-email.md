# Waitlist Email Feature Documentation

This document explains how the waitlist email feature works in the TAPPr website.

## Overview

The waitlist feature allows users to sign up for updates about TAPPr by submitting their email address. When a user submits their email, the system sends a notification email to the administrator using the Resend email service.

## Components

The waitlist feature consists of the following components:

1. **WaitlistForm Component**: A React component that renders a form for users to enter their email address.
2. **Waitlist API Endpoint**: A Next.js API route that processes the form submission and sends the email notification.
3. **Resend Integration**: The email service used to send the notification emails.

## Setup

To set up the waitlist email feature, you need to:

1. Install the Resend SDK: `npm install resend`
2. Add the required environment variables to your `.env.local` file:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   NOTIFICATION_EMAIL=your-email@example.com
   ```
3. Get an API key from [Resend](https://resend.com) by creating an account and generating an API key.

## How It Works

1. The user enters their email address in the waitlist form on the website.
2. When the form is submitted, a POST request is sent to the `/api/waitlist` endpoint.
3. The API endpoint validates the email address and sends a notification email to the administrator using Resend.
4. The user receives a success message if the submission is successful, or an error message if there's a problem.

## Email Template

The notification email includes:
- A heading: "New Waitlist Signup"
- The user's email address
- The date and time of the signup
- A footer indicating it's an automated message from the TAPPr website

## Security Considerations

- The API endpoint validates the email format to prevent invalid submissions.
- Error handling is implemented to prevent information disclosure.
- The Resend API key is stored as an environment variable and not exposed to the client.

## Testing

To test the waitlist feature:
1. Make sure you have set up the required environment variables.
2. Start the development server: `npm run dev`
3. Navigate to the waitlist section on the website.
4. Enter your email address and submit the form.
5. Check the email address specified in the `NOTIFICATION_EMAIL` environment variable for the notification.

## Troubleshooting

If you encounter issues with the waitlist feature:
1. Check that the Resend API key is correct and active.
2. Verify that the `NOTIFICATION_EMAIL` is a valid email address.
3. Check the server logs for any error messages.
4. Make sure the Resend service is operational.

## Customization

To customize the waitlist feature:
1. Modify the `WaitlistForm` component to change the form's appearance.
2. Update the email template in the API endpoint to change the content of the notification email.
3. Add additional fields to the form if you want to collect more information from users.
