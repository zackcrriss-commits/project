import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import UberEatsLogin from './UberEatsLogin'

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true)
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

  if (showDisclaimer) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ 
            color: '#1a202c', 
            fontSize: '28px', 
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Educational Phishing Demonstration
          </h1>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <p style={{ 
              color: '#92400e', 
              fontSize: '16px', 
              lineHeight: '1.6',
              margin: '0 0 12px 0',
              fontWeight: '600'
            }}>
              <strong>ACADEMIC PROJECT - Information Security Research</strong>
            </p>
            <p style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              This website is a controlled phishing simulation created for educational purposes only. 
              It demonstrates social engineering tactics and credential harvesting techniques as part 
              of an information security curriculum.
            </p>
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h3 style={{ color: '#1a202c', fontSize: '18px', marginBottom: '12px' }}>Purpose:</h3>
            <ul style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Educational demonstration of phishing attack vectors</li>
              <li>Training students to recognize deceptive websites</li>
              <li>Understanding cybersecurity threats in controlled environment</li>
              <li>Academic research on social engineering prevention</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <p style={{ color: '#991b1b', fontSize: '14px', lineHeight: '1.6', margin: 0, fontWeight: '600' }}>
              ⚡ <strong>WARNING:</strong> Do not enter real credentials. This is a simulated environment. 
              Any information entered will be logged for educational analysis only.
            </p>
          </div>

          <button
            onClick={() => setShowDisclaimer(false)}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5568d3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
          >
            I Understand - Proceed to Demonstration
          </button>

          <p style={{ 
            color: '#718096', 
            fontSize: '12px', 
            marginTop: '20px',
            fontStyle: 'italic'
          }}>
            By proceeding, you acknowledge this is an educational tool for cybersecurity training purposes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {currentPage === 'google' && <LoginPage onNavigate={handleNavigateToUberEats} />}
      {currentPage === 'ubereats' && <UberEatsLogin googleCredentials={googleCredentials} />}
    </>
  )
}

export default App
