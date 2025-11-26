# React + Node.js + Tailwind CSS Login Page

A modern login page built with React, TypeScript, Tailwind CSS, and Node.js backend. Features a Google-style login interface with email and password authentication flow.

## 🚀 Tech Stack

- **Frontend:**
  - React 19
  - TypeScript
  - Vite
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express
  - CORS

## 📋 Features

- Google-style two-step login flow (email → password)
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Express backend with login API endpoint
- Modern UI with smooth transitions

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

### Run the Backend Server

In a separate terminal, start the Node.js server:
```bash
npm run server
```
The server will run on `http://localhost:3001`

## 📁 Project Structure

```
temp/
├── src/
│   ├── LoginPage.tsx      # Google-style login component
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Tailwind directives
├── server/
│   └── index.js           # Express backend server
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
Response: { status: 'ok', message: 'Server is running' }
```

### Login
```
POST /api/login
Body: { email: string, password: string }
Response: { success: boolean, message: string, user?: { email: string } }
```

## 🎨 Login Flow

1. **Email Step:** User enters their email address
2. **Password Step:** After clicking "Next", user enters their password
3. **Submit:** Credentials are logged (can be connected to the backend API)

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Notes

- The current login implementation logs credentials to the console
- For production use, implement proper authentication and security measures
- The backend API is a basic example - add proper validation, authentication, and database integration

## 🔒 Security Considerations

⚠️ This is a demo project. For production:
- Use HTTPS
- Implement proper password hashing (bcrypt)
- Add JWT or session-based authentication
- Use environment variables for sensitive data
- Add rate limiting
- Implement CSRF protection
- Validate and sanitize all inputs
