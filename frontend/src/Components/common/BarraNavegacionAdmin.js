import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../archivos/img/logo.png";
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/BarraNavegacion.css'; 

export const BarraNavegacionAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/admin/perfil');
  };

  const handleAddEvent = () => {
    navigate('/admin/gestionar-eventos');
  };

  return (
    <Navbar bg="light" expand="lg" className="barra-personalizada">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin-dashboard">
          <img src={logo} alt="Logo" height="30" className="d-inline-block align-top logo-barra" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav" className="justify-content-end">
          <Nav>
            
            
            <Nav.Link as={Link} to="/admin-usuarios">Usuarios</Nav.Link>
            <Nav.Link as={Link} to="/admin-reportes">Reportes</Nav.Link>
            <Button 
              variant="success" 
              className="mx-2"
              onClick={handleAddEvent}
            >
              Gestionar Eventos
            </Button>
            <NavDropdown 
              title={user ? `${user.name || user.email}` : 'Cargando...'} 
              id="admin-nav-dropdown"
              align="end"
            >
             
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};