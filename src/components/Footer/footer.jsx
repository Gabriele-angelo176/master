import './footer.css'

const MyFooter = () => {
  return (
    <footer className="my-footer">
      <div className="my-footer__content">
        <p>© 2026 EPIKBOOKS</p>
        <nav className="my-footer__links" aria-label="Footer navigation">
          <a href="#">Home</a>
          <a href="#">Catalogo</a>
          <a href="#">Contatti</a>
        </nav>
      </div>
    </footer>
  )
}

export default MyFooter
