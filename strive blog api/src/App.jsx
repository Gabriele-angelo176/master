import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('striveBlogToken') || '')
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('striveBlogUser')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [view, setView] = useState(token ? 'home' : 'login')
  const [message, setMessage] = useState('')
  const [authors, setAuthors] = useState([])
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    if (token) {
      localStorage.setItem('striveBlogToken', token)
    } else {
      localStorage.removeItem('striveBlogToken')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('striveBlogUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('striveBlogUser')
    }
  }, [user])

  useEffect(() => {
    if (!token) {
      setAuthors([])
      setView('login')
      return
    }

    setView('home')
    fetchAuthors()
  }, [token])

  const fetchAuthors = async () => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/authors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Errore nel recupero degli autori')
      }

      setAuthors(data.authors || [])
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login non riuscito')
      }

      setToken(data.token)
      setUser(data.user)
      setMessage('Login effettuato con successo')
      setView('home')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registrazione non riuscita')
      }

      setMessage('Registrazione completata. Puoi accedere ora.')
      setView('login')
      setRegisterData({ name: '', email: '', password: '' })
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleLogout = () => {
    setToken('')
    setUser(null)
    setMessage('Logout effettuato')
  }

  return (
    <div className="app-shell">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <main className="content-panel">
        {!token ? (
          <section className="auth-card">
            <p className="eyebrow">Token Based Authentication</p>
            <h1>Compito - Gestione degli accessi</h1>

            <div className="switcher" role="tablist" aria-label="Pagine di accesso">
              <button
                type="button"
                className={view === 'login' ? 'tab active' : 'tab'}
                onClick={() => setView('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={view === 'register' ? 'tab active' : 'tab'}
                onClick={() => setView('register')}
              >
                Registrazione
              </button>
            </div>

            {message && <div className="message">{message}</div>}

            {view === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <label>
                  Email
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(event) =>
                      setLoginData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="tuo@email.com"
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(event) =>
                      setLoginData((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="••••••••"
                    required
                  />
                </label>

                <button type="submit" className="primary-button">
                  Accedi
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <label>
                  Nome
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(event) =>
                      setRegisterData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Mario Rossi"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(event) =>
                      setRegisterData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="tuo@email.com"
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(event) =>
                      setRegisterData((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="minimo 6 caratteri"
                    required
                  />
                </label>

                <button type="submit" className="primary-button">
                  Registrati
                </button>
              </form>
            )}
          </section>
        ) : (
          <section className="home-card">
            <header className="home-header">
              <div>
                <p className="eyebrow">Bentornato</p>
                <h2>{user?.name || 'Utente'}</h2>
              </div>

              <button type="button" className="secondary-button" onClick={handleLogout}>
                Logout
              </button>
            </header>

            <div className="status-box">
              <p>Token salvato nel localStorage</p>
              <span>{user?.email}</span>
            </div>

            <button type="button" className="primary-button" onClick={fetchAuthors}>
              Aggiorna autori
            </button>

            <div className="authors-panel">
              <h3>Autori protetti</h3>
              {authors.length === 0 ? (
                <p className="empty-state">Nessun autore trovato.</p>
              ) : (
                <ul className="author-list">
                  {authors.map((author) => (
                    <li key={author._id || author.email}>
                      <strong>{author.nome} {author.cognome}</strong>
                      <span>{author.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
