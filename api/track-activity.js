// Vercel Serverless Function - Track Activity
// Stores user activity logs in-memory (for demo purposes)
// In production, use Vercel KV, PostgreSQL, or similar database

// In-memory storage (resets on cold starts - acceptable for demo)
let activitiesStore = [];

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Add activity
  if (req.method === 'POST') {
    try {
      const activityData = req.body;
      
      const newActivity = {
        ...activityData,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        receivedAt: new Date().toISOString(),
      };
      
      activitiesStore.push(newActivity);
      
      // Keep only last 5000 activities to prevent memory issues
      if (activitiesStore.length > 5000) {
        activitiesStore = activitiesStore.slice(-5000);
      }
      
      return res.status(200).json({ success: true, message: 'Activity tracked' });
    } catch (error) {
      console.error('Error tracking activity:', error);
      return res.status(500).json({ error: 'Failed to track activity', details: error.message });
    }
  }

  // GET: Retrieve activities
  if (req.method === 'GET') {
    try {
      const { sessionId } = req.query;
      
      if (sessionId) {
        const sessionActivities = activitiesStore.filter(a => a.sessionId === sessionId);
        return res.status(200).json({ success: true, activities: sessionActivities });
      }
      
      return res.status(200).json({ success: true, activities: activitiesStore });
    } catch (error) {
      console.error('Error getting activities:', error);
      return res.status(500).json({ error: 'Failed to get activities', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
