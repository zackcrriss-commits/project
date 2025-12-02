import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACTIVITIES_FILE = path.join(__dirname, 'activities.json');

// Get all activities
function getActivities() {
  try {
    if (fs.existsSync(ACTIVITIES_FILE)) {
      const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading activities:', error);
  }
  return [];
}

// Save activities
function saveActivities(activities) {
  try {
    fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(activities, null, 2));
  } catch (error) {
    console.error('Error saving activities:', error);
  }
}

// Add activity
function addActivity(activityData) {
  const activities = getActivities();
  const newActivity = {
    ...activityData,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    receivedAt: new Date().toISOString(),
  };
  activities.push(newActivity);
  
  // Keep only last 10000 activities
  const trimmedActivities = activities.slice(-10000);
  saveActivities(trimmedActivities);
  
  return newActivity;
}

// Get activities by session
function getActivitiesBySession(sessionId) {
  const activities = getActivities();
  return activities.filter(a => a.sessionId === sessionId);
}

// Get all sessions
function getAllSessions() {
  const activities = getActivities();
  const sessionsMap = new Map();
  
  activities.forEach(activity => {
    if (!sessionsMap.has(activity.sessionId)) {
      sessionsMap.set(activity.sessionId, {
        sessionId: activity.sessionId,
        firstSeen: activity.timestamp,
        lastSeen: activity.timestamp,
        userAgent: activity.userAgent,
        screenResolution: activity.screenResolution,
        activityCount: 0,
        pages: new Set(),
      });
    }
    
    const session = sessionsMap.get(activity.sessionId);
    session.lastSeen = activity.timestamp;
    session.activityCount++;
    if (activity.page) session.pages.add(activity.page);
  });
  
  return Array.from(sessionsMap.values()).map(session => ({
    ...session,
    pages: Array.from(session.pages),
  }));
}

export {
  getActivities,
  saveActivities,
  addActivity,
  getActivitiesBySession,
  getAllSessions,
};
