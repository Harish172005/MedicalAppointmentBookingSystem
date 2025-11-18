// src/components/Navbar.js
import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuthData } from '../utils/auth';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Medical Appointment System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ alignItems: 'center' }}>
            {user && (
              <>
                <Nav.Link as={Link} to={`/${user.role}/dashboard`}>
                  <FaUserCircle style={{ marginRight: '5px' }} />
                  {user.name}
                </Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginRight: '5px' }} />
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
