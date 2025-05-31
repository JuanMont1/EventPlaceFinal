import { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "../../archivos/img/logo.png";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/BarraNavegacion.css";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { BarraNavegacionAdmin } from "../common/BarraNavegacionAdmin";

export const BarraNavegacion = () => {
  const [desplazado, setDesplazado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [menuExpandido, setMenuExpandido] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const manejarScroll = () => {
      setDesplazado(window.scrollY > 50);
    };

    window.addEventListener("scroll", manejarScroll);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("Rol del usuario:", userData.role);
          setUsuarioActivo({
            name: user.displayName,
            email: user.email,
            role: userData.role || "user",
          });
        } else {
          console.log(
            "No se encontró documento de usuario, asignando rol 'user'"
          );
          setUsuarioActivo({
            name: user.displayName,
            email: user.email,
            role: "user",
          });
        }
      } else {
        setUsuarioActivo(null);
      }
    });

    return () => {
      window.removeEventListener("scroll", manejarScroll);
      unsubscribe();
    };
  }, []);

  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
    console.log("Buscando:", e.target.value);
  };

  const irALogin = () => {
    navegar("/login");
  };

  const irAPerfil = () => {
    navegar("/perfil");
  };

  const cerrarSesion = () => {
    auth
      .signOut()
      .then(() => {
        navegar("/");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <>
      {usuarioActivo && usuarioActivo.role === "admin" ? (
        <BarraNavegacionAdmin
          usuarioActivo={usuarioActivo}
          cerrarSesion={cerrarSesion}
        />
      ) : (
        <>
          <div
            className={`fondo-barra ${desplazado ? "con-scroll" : ""}`}
          ></div>
          <Navbar
            expand="lg"
            className={`barra-personalizada ${desplazado ? "con-scroll" : ""}`}
            expanded={menuExpandido}
          >
            <Container fluid className="px-4">
              <Navbar.Brand as={Link} to="/MisSuscripciones" className="me-0">
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
              <Navbar.Collapse
                id="menu-navegacion"
                className="justify-content-end"
              >
                <Nav className="alineacion-items">
                  <Nav.Link as={Link} to="/">
                    Inicio
                  </Nav.Link>
                  <Nav.Link as={Link} to="/eventos">
                    Galeria De Eventos
                  </Nav.Link>
                  <Nav.Link as={Link} to="/calendario">
                    Calendario
                  </Nav.Link>
                  <Nav.Link as={Link} to="/MisSuscripciones">
                    Mis Suscripciones
                  </Nav.Link>
                  <NavDropdown title="Foro" id="menu-foro">
                    <NavDropdown.Item as={Link} to="/foro/eventos">
                      Foro de Eventos
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/proximos-eventos">
                    Próximos Eventos
                  </Nav.Link>
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
                    {usuarioActivo ? (
                      <>
                        <NavDropdown
                          title={
                            <>
                              <FaUserCircle className="icono-usuario" />
                              <span className="nombre-usuario">
                                {usuarioActivo.name}
                              </span>
                            </>
                          }
                          id="menu-usuario"
                        >
                          <NavDropdown.Item as={Link} to="/perfil">
                            Ver Perfil
                          </NavDropdown.Item>
                          <NavDropdown.Item as={Link} to="/MisSuscripciones">
                            Mis Suscripciones
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item onClick={cerrarSesion}>
                            Cerrar Sesión
                          </NavDropdown.Item>
                        </NavDropdown>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={irALogin}
                          className="btn-iniciar-sesion btn-transparente me-2"
                        >
                          Iniciar sesión
                        </Button>
                      </>
                    )}
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
      )}
    </>
  );
};
