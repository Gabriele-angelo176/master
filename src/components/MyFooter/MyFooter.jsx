import './MyFooter.css'

const MyFooter = () => {
  return (
    <footer className="myfooter">
      <div className="myfooter__content">
        <p>© 2026 EPIKBOOKS</p>

        <nav className="myfooter__links" aria-label="Footer navigation">
          <a href="#">Home</a>
          <a href="#">Catalogo</a>
          <a href="#">Contatti</a>
        </nav>
      </div>
    </footer>
  )
}

export default MyFooter
