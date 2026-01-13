// In-memory storage for activities (shared with track-activity.js)
let activities = [];

// Vercel serverless function handler
export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    return res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
