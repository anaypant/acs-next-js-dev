import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import config from '@/lib/emailconfig';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Log environment for debugging (without sensitive data)

  // Configure nodemailer SMTP transport using config
  const transporter = nodemailer.createTransport({
    ...config.email.smtp,
    debug: true, // Enable debug logging
    logger: true, // Enable logger
  });

  // Verify SMTP connection
  try {
    await transporter.verify();
  } catch (error) {
    console.error('Contact API: SMTP connection verification failed:', error);
    // Add more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code;
    const errorResponse = (error as any)?.response;
    
    return NextResponse.json({ 
      error: 'Email service connection failed.',
      details: {
        message: errorMessage,
        code: errorCode,
        response: errorResponse,
        env: config.env,
      }
    }, { status: 500 });
  }

  try {
    // Ensure we're using the authenticated email address
    const fromAddress = config.email.smtp.auth.user;
    const mailOptions = {
      from: `${config.email.from.name} <${fromAddress}>`,
      to: config.email.to,
      subject: `[${config.site.name} Contact] ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    };


    const info = await transporter.sendMail(mailOptions);


    return NextResponse.json({ 
      success: true,
      messageId: info.messageId,
      response: info.response,
      env: config.env,
    });
  } catch (error) {
    console.error('Contact API: Failed to send email:', error);
    // Add more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code;
    const errorResponse = (error as any)?.response;
    
    return NextResponse.json({ 
      error: 'Failed to send email.',
      details: {
        message: errorMessage,
        code: errorCode,
        response: errorResponse,
        env: config.env,
      }
    }, { status: 500 });
  }
} 