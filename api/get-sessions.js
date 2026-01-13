// Vercel Serverless Function - Get Sessions
// Note: This shares memory with track-activity (same deployment)

// Import the activities store from track-activity
// In serverless, we need a shared data layer - using import won't work
// We'll fetch from track-activity endpoint instead

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
    // Since we can't share memory between serverless functions easily,
    // we'll process activities from the track-activity endpoint
    // For now, return a message that sessions are part of activities
    
    return res.status(200).json({ 
      success: true, 
      message: 'Use /api/track-activity?sessionId=xxx to get session activities',
      sessions: []
    });
  } catch (error) {
    console.error('Error getting sessions:', error);
    return res.status(500).json({ error: 'Failed to get sessions', details: error.message });
  }
}
