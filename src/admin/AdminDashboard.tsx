import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  sessionId: string;
  timestamp: string;
  action: string;
  target: string;
  value?: string;
  page: string;
  userAgent: string;
  screenResolution: string;
  receivedAt: string;
}

interface Session {
  sessionId: string;
  activities: Activity[];
  firstSeen: string;
  lastSeen: string;
  activityCount: number;
}

export default function AdminDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [view, setView] = useState<'sessions' | 'all-activities'>('sessions');

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? '/api/track-activity' 
        : 'http://localhost:3001/api/activities';
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities || []);
        processSessions(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process activities into sessions
  const processSessions = (activityList: Activity[]) => {
    const sessionMap = new Map<string, Session>();
    
    activityList.forEach(activity => {
      if (!sessionMap.has(activity.sessionId)) {
        sessionMap.set(activity.sessionId, {
          sessionId: activity.sessionId,
          activities: [],
          firstSeen: activity.timestamp,
          lastSeen: activity.timestamp,
          activityCount: 0,
        });
      }
      
      const session = sessionMap.get(activity.sessionId)!;
      session.activities.push(activity);
      session.lastSeen = activity.timestamp;
      session.activityCount++;
    });
    
    // Sort sessions by most recent first
    const sortedSessions = Array.from(sessionMap.values()).sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );
    
    setSessions(sortedSessions);
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchActivities();
    
    if (autoRefresh) {
      const interval = setInterval(fetchActivities, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get activity icon
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'page_view':
        return '👁️';
      case 'input_focus':
        return '🎯';
      case 'input_blur':
        return '✅';
      case 'input_change':
        return '⌨️';
      case 'button_click':
        return '🖱️';
      case 'link_click':
        return '🔗';
      case 'form_submit':
        return '📤';
      case 'page_exit':
        return '🚪';
      default:
        return '📍';
    }
  };

  // Get activity color
  const getActivityColor = (action: string) => {
    switch (action) {
      case 'page_view':
        return 'bg-blue-100 text-blue-800';
      case 'input_focus':
      case 'input_blur':
      case 'input_change':
        return 'bg-purple-100 text-purple-800';
      case 'button_click':
      case 'link_click':
        return 'bg-green-100 text-green-800';
      case 'form_submit':
        return 'bg-red-100 text-red-800';
      case 'page_exit':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Extract credentials from activities
  const getCredentials = (sessionActivities: Activity[]) => {
    const formSubmissions = sessionActivities.filter(a => a.action === 'form_submit');
    const credentials: any[] = [];
    
    formSubmissions.forEach(activity => {
      try {
        const data = JSON.parse(activity.value || '{}');
        credentials.push({
          page: activity.page,
          timestamp: activity.timestamp,
          data,
        });
      } catch (e) {
        // Ignore parse errors
      }
    });
    
    return credentials;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activity Monitoring Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time user activity tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                  Auto-refresh (3s)
                </label>
              </div>
              <button
                onClick={() => fetchActivities()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Activities</p>
                <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Activity</p>
                <p className="text-sm font-semibold text-gray-900">
                  {activities.length > 0 ? formatTimestamp(activities[activities.length - 1].timestamp) : 'No activity'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setView('sessions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'sessions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📁 Sessions View
          </button>
          <button
            onClick={() => setView('all-activities')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'all-activities'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 All Activities
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {view === 'sessions' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sessions ({sessions.length})</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.sessionId}
                    onClick={() => setSelectedSession(session.sessionId)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedSession === session.sessionId
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Session {session.sessionId.split('_')[1]}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {session.activityCount} activities
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(session.lastSeen)}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No sessions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Activities will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Session Details */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              {selectedSession ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Session Details</h2>
                    <p className="text-sm text-gray-500 mt-1">ID: {selectedSession}</p>
                  </div>
                  
                  {(() => {
                    const session = sessions.find(s => s.sessionId === selectedSession);
                    if (!session) return null;
                    
                    const credentials = getCredentials(session.activities);
                    
                    return (
                      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                        {/* Captured Credentials */}
                        {credentials.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Captured Credentials
                            </h3>
                            {credentials.map((cred, idx) => (
                              <div key={idx} className="mb-3 last:mb-0">
                                <p className="text-xs text-red-600 font-medium">{cred.page} - {formatTimestamp(cred.timestamp)}</p>
                                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">{JSON.stringify(cred.data, null, 2)}</pre>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Activity Timeline */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Timeline</h3>
                          <div className="space-y-2">
                            {session.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <span className="text-2xl">{getActivityIcon(activity.action)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.action)}`}>
                                      {activity.action}
                                    </span>
                                    <span className="text-xs text-gray-500">{activity.target}</span>
                                  </div>
                                  {activity.value && (
                                    <p className="text-xs text-gray-600 mb-1">{activity.value}</p>
                                  )}
                                  <p className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p className="mt-4 text-gray-500">Select a session to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* All Activities View */
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Activities ({activities.length})</h2>
            </div>
            <div className="p-4 space-y-2 max-h-[700px] overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">{getActivityIcon(activity.action)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.action)}`}>
                        {activity.action}
                      </span>
                      <span className="text-xs text-gray-500">{activity.target}</span>
                      <span className="text-xs text-gray-400">• {activity.page}</span>
                    </div>
                    {activity.value && (
                      <p className="text-xs text-gray-600 mb-1">{activity.value}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatTimestamp(activity.timestamp)}</span>
                      <span>Session: {activity.sessionId.split('_')[1]}</span>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No activities recorded yet</p>
                  <p className="text-sm text-gray-400 mt-1">User interactions will appear here in real-time</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
