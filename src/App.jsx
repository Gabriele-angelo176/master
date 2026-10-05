import './App.css'

function App() {
  return (
    <main className="task-page">
      <section className="content-block">
        <header className="page-header">
          <h1>Compito - Upload di immagini:</h1>
        </header>

        <ul className="task-list">
          <li>
            <span className="bullet" aria-hidden="true"></span>
            <p>Il backend dovrebbe includere queste nuove routes:</p>
          </li>

          <li>
            <span className="bullet" aria-hidden="true"></span>
            <p>
              PATCH /authors/:authorId/avatar, carica un'immagine per l'autore
              specificato e salva l'URL creata da Cloudinary nel database.
            </p>
          </li>

          <li>
            <span className="bullet" aria-hidden="true"></span>
            <p>
              PATCH /blogPosts/:blogPostId/cover, carica un'immagine per il post
              specificato dall'id. Salva l'URL creato da Cloudinary nel post
              corrispondente.
            </p>
          </li>

          <li className="extra">
            <span className="bullet" aria-hidden="true"></span>
            <p>
              EXTRA <span className="highlight">(facoltativo)!</span>: Invia un
              email all'autore quando pubblica un nuovo blog post e quando un nuovo
              autore si registra sulla piattaforma
            </p>
          </li>
        </ul>
      </section>

      <section className="warning-section">
        <h2>Attenzione!</h2>

        <ul className="warning-list">
          <li>
            <span className="bullet" aria-hidden="true"></span>
            <p>
              Assicurati di inserire l'API key, e l'API secret di Cloudinary sul tuo
              .env
            </p>
          </li>

          <li>
            <span className="bullet" aria-hidden="true"></span>
            <p>
              Assicurati di importare "dotenv/config" per inizializzare dotenv (non
              è necessario installarlo)
            </p>
          </li>

          <li>
            <span className="bullet" aria-hidden="true"></span>
            <p>
              Assicurati di avere la key di sendgrid nel tuo .env sotto la voce
              SENDGRID_API_KEY
            </p>
          </li>
        </ul>
      </section>
    </main>
  )
}

export default App
