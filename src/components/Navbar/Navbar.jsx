import './Navbar.css'

import React from 'react';
import { Button } from 'react-bootstrap';
// src/components/CustomNavbar.jsx

import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Brand / Logo */}
        <Navbar.Brand href="/">MyApp</Navbar.Brand>

        {/* Toggle button for mobile view */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Collapsible content */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>

            {/* Dropdown menu */}
            <NavDropdown title="Services" id="services-dropdown">
              <NavDropdown.Item href="/services/web">Web Development</NavDropdown.Item>
              <NavDropdown.Item href="/services/mobile">Mobile Apps</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/services/consulting">Consulting</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Right-aligned links */}
          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
