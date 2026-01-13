// In-memory storage for activities (no database)
let activities = [];

// Vercel serverless function handler
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

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
    
    return res.status(200).json({ success: true, message: 'Activity tracked' });
  } catch (error) {
    console.error('Error tracking activity:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
