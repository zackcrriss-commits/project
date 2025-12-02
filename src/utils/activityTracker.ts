// Activity Tracker Utility
// Tracks user interactions and sends to backend

interface ActivityData {
  sessionId: string;
  timestamp: string;
  action: string;
  target: string;
  value?: string;
  page: string;
  userAgent: string;
  screenResolution: string;
}

// Generate unique session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('phishing_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('phishing_session_id', sessionId);
  }
  return sessionId;
};

// Get user info
const getUserInfo = () => ({
  userAgent: navigator.userAgent,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
  language: navigator.language,
  platform: navigator.platform,
});

// Send activity to backend
export const trackActivity = async (action: string, target: string, value?: string, page?: string) => {
  const activityData: ActivityData = {
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    action,
    target,
    value,
    page: page || window.location.pathname,
    ...getUserInfo(),
  };

  try {
    const apiUrl = import.meta.env.PROD 
      ? '/api/track-activity' 
      : 'http://localhost:3001/api/track-activity';
    
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
};

// Track input focus
export const trackInputFocus = (inputName: string, page?: string) => {
  trackActivity('input_focus', inputName, undefined, page);
};

// Track input blur
export const trackInputBlur = (inputName: string, value: string, page?: string) => {
  trackActivity('input_blur', inputName, value ? '[hidden]' : '[empty]', page);
};

// Track input change
export const trackInputChange = (inputName: string, hasValue: boolean, page?: string) => {
  trackActivity('input_change', inputName, hasValue ? '[typing]' : '[cleared]', page);
};

// Track button click
export const trackButtonClick = (buttonName: string, page?: string) => {
  trackActivity('button_click', buttonName, undefined, page);
};

// Track link click
export const trackLinkClick = (linkName: string, page?: string) => {
  trackActivity('link_click', linkName, undefined, page);
};

// Track form submission
export const trackFormSubmit = (formName: string, data: any, page?: string) => {
  trackActivity('form_submit', formName, JSON.stringify(data), page);
};

// Track page view
export const trackPageView = (pageName: string) => {
  trackActivity('page_view', pageName, undefined, pageName);
};

// Track page exit
export const trackPageExit = (pageName: string) => {
  trackActivity('page_exit', pageName, undefined, pageName);
};
