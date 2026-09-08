import { Link } from 'react-router-dom'

const NotFound = () => (
  <main className="not-found">
    <h1>404</h1>
    <p>La pagina che stai cercando non esiste.</p>
    <Link to="/">Torna alla homepage</Link>
  </main>
)

export default NotFound
