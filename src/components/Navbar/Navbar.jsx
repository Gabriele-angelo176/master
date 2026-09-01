import './Navbar.css'

import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'

const CustomNavbar = ({ searchTerm, onSearchChange }) => {
  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'

  return (
    <Navbar bg={isDarkTheme ? 'dark' : 'light'} variant={isDarkTheme ? 'dark' : 'light'} expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">MyApp</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>

            <NavDropdown title="Services" id="services-dropdown">
              <NavDropdown.Item href="/services/web">Web Development</NavDropdown.Item>
              <NavDropdown.Item href="/services/mobile">Mobile Apps</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/services/consulting">Consulting</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="navbar-controls">
            <input
              className="navbar-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search books"
              aria-label="Search books by title"
            />

            <Button variant={isDarkTheme ? 'light' : 'dark'} onClick={toggleTheme}>
              {isDarkTheme ? 'Light mode' : 'Dark mode'}
            </Button>
          </div>

          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar
