// Vercel Serverless Function - Track Activity
// Stores user activity logs in PostgreSQL database

import {
  addActivity,
  getAllActivities,
  getActivitiesBySession,
  getAllSessions,
  initializeDatabase,
  testConnection
} from '../src/utils/database.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize database connection and tables
    await testConnection();
    await initializeDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    });
  }

  // POST: Add activity
  if (req.method === 'POST') {
    try {
      const activityData = req.body;

      // Get client IP address
      const ipAddress = req.headers['x-forwarded-for'] ||
                       req.headers['x-real-ip'] ||
                       req.connection.remoteAddress ||
                       req.socket.remoteAddress ||
                       'unknown';

      const activity = await addActivity({
        ...activityData,
        ipAddress: ipAddress
      });

      return res.status(200).json({
        success: true,
        message: 'Activity tracked',
        activityId: activity.id
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
      return res.status(500).json({
        error: 'Failed to track activity',
        details: error.message
      });
    }
  }

  // GET: Retrieve activities
  if (req.method === 'GET') {
    try {
      const { sessionId, limit = 5000 } = req.query;

      if (sessionId) {
        // Get activities for specific session
        const activities = await getActivitiesBySession(sessionId);
        return res.status(200).json({
          success: true,
          activities: activities
        });
      } else {
        // Get all activities
        const activities = await getAllActivities(parseInt(limit));
        return res.status(200).json({
          success: true,
          activities: activities
        });
      }
    } catch (error) {
      console.error('Error getting activities:', error);
      return res.status(500).json({
        error: 'Failed to get activities',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
