// Vercel Serverless Function - Get Sessions
// Retrieves session data from PostgreSQL database

import {
  getAllSessions,
  getSessionsByDateRange,
  initializeDatabase,
  testConnection
} from '../src/utils/database.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  try {
    const { startDate, endDate, limit = 1000 } = req.query;

    let sessions;

    if (startDate && endDate) {
      // Get sessions within date range
      sessions = await getSessionsByDateRange(startDate, endDate);
    } else {
      // Get all sessions
      sessions = await getAllSessions(parseInt(limit));
    }

    return res.status(200).json({
      success: true,
      sessions: sessions
    });
  } catch (error) {
    console.error('Error getting sessions:', error);
    return res.status(500).json({
      error: 'Failed to get sessions',
      details: error.message
    });
  }
}
