import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "../../archivos/img/logo.png";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/BarraNavegacion.css";

export const BarraNavegacion2 = () => {
  const [desplazado, setDesplazado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { user, logout } = useAuth();
  const [menuExpandido, setMenuExpandido] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const manejarScroll = () => {
      setDesplazado(window.scrollY > 50);
    };

    window.addEventListener("scroll", manejarScroll);

    return () => {
      window.removeEventListener("scroll", manejarScroll);
    };
  }, []);

  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const cerrarSesion = useCallback(async () => {
    if (cerrandoSesion) return;
    setCerrandoSesion(true);
    try {
      await logout();
      navegar("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setCerrandoSesion(false);
    }
  }, [cerrandoSesion, logout, navegar]);

  return (
    <div>
      <div className={`fondo-barra ${desplazado ? "con-scroll" : ""}`}></div>
      <Navbar
        expand="lg"
        className={`barra-personalizada ${desplazado ? "con-scroll" : ""}`}
        expanded={menuExpandido}
      >
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/" className="me-0">
            <img
              src={logo}
              alt="Universidad de Cundinamarca"
              className={`logo-barra ${desplazado ? "con-scroll" : ""}`}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="menu-navegacion"
            onClick={() => setMenuExpandido(!menuExpandido)}
          >
            <FaBars />
          </Navbar.Toggle>
          <Navbar.Collapse id="menu-navegacion" className="justify-content-end">
            <Nav className="alineacion-items">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/eventos">
                Galería de Eventos
              </Nav.Link>
              <Nav.Link as={Link} to="/proximos-eventos">
                Próximos Eventos
              </Nav.Link>
              <Nav.Link as={Link} to="/calendario">
                Calendario
              </Nav.Link>
              <NavDropdown title="Foro" id="menu-foro">
                <NavDropdown.Item as={Link} to="/foro/eventos">
                  Foro de Eventos
                </NavDropdown.Item>
              </NavDropdown>
              {user && (
                <Nav.Link as={Link} to="/MisSuscripciones">
                  Mis Suscripciones
                </Nav.Link>
              )}
              <div className="busqueda-seccion d-none d-lg-flex ms-3">
                <FaSearch className="icono-busqueda" />
                <input
                  type="text"
                  className="input-busqueda"
                  value={busqueda}
                  onChange={manejarCambioBusqueda}
                  placeholder="Buscar eventos..."
                />
              </div>
              <div className="seccion-usuario ms-3">
                {user ? (
                  <NavDropdown
                    title={
                      <>
                        <FaUserCircle className="icono-usuario" />
                        <span className="nombre-usuario">
                          {user.displayName || "Usuario"}
                        </span>
                      </>
                    }
                    id="menu-usuario"
                  >
                    <NavDropdown.Item as={Link} to="/perfil">
                      Mi Perfil
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/MisSuscripciones">
                      Mis Suscripciones
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={cerrarSesion}
                      disabled={cerrandoSesion}
                    >
                      {cerrandoSesion ? "Cerrando sesión..." : "Cerrar Sesión"}
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Button
                    onClick={() => navegar("/login")}
                    className="btn-login btn-transparente"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
