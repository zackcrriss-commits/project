# React + Tailwind CSS Login Page

A modern login page built with React, TypeScript, and Tailwind CSS. Features a Google-style login interface with email and password authentication flow.

## 🚀 Tech Stack

- **Frontend:**
  - React 19
  - TypeScript
  - Vite
  - Tailwind CSS

## 📋 Features

- Google-style two-step login flow (email → password)
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Modern UI with smooth transitions
- Activity tracking (console logging)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Development Mode

Run the frontend (React + Vite):
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
temp/
├── src/
│   ├── LoginPage.tsx      # Google-style login component
│   ├── UberEatsLogin.tsx  # Uber Eats login component
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   ├── utils/
│   │   └── activityTracker.ts # Activity tracking utility
│   └── index.css          # Tailwind directives
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Login Flow

1. **Email Step:** User enters their email address
2. **Password Step:** After clicking "Next", user enters their password
3. **Submit:** Credentials are logged to console

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Notes

- The current login implementation logs credentials to the console
- Activity tracking logs user interactions to console
- This is a frontend-only demo project

## 🔒 Security Considerations

⚠️ This is a demo project. For production:
- Implement proper authentication and security measures
- Use HTTPS
- Add proper password hashing (bcrypt)
- Add JWT or session-based authentication
- Use environment variables for sensitive data
- Add rate limiting
- Implement CSRF protection
- Validate and sanitize all inputs
