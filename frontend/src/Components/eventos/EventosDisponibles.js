import React, { useState, useMemo, navigate } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import {
  FaGraduationCap,
  FaMusic,
  FaFootballBall,
  FaPalette,
  FaCode,
  FaUsers,
  FaCalendarAlt,
  FaSearch,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import "../../styles/MisSuscripciones.css";
import EncuestaEvento from "../admin/EncuestaEvento";

const categories = [
  { id: 1, name: "Académico", icon: <FaGraduationCap />, color: "#4285F4" },
  { id: 2, name: "Cultural", icon: <FaMusic />, color: "#EA4335" },
  { id: 3, name: "Deportivo", icon: <FaFootballBall />, color: "#34A853" },
  { id: 4, name: "Artístico", icon: <FaPalette />, color: "#FBBC05" },
  { id: 5, name: "Tecnológico", icon: <FaCode />, color: "#FF6D01" },
];

const EventosDisponibles = ({
  eventosDisponibles,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  filtro,
  setFiltro,
  isSuscrito,
  toggleSuscripcion,
  currentUser,
}) => {
  const [animatingEventId, setAnimatingEventId] = useState(null);

  // Filtrar eventos según categoría y filtro de texto
  const eventosFiltrados = useMemo(() => {
    return eventosDisponibles.filter(
      (evento) =>
        (!categoriaSeleccionada ||
          evento.categoria === categoriaSeleccionada) &&
        (!filtro || evento.nombre.toLowerCase().includes(filtro.toLowerCase()))
    );
  }, [eventosDisponibles, categoriaSeleccionada, filtro]);

  // Manejar suscripción visual
  const handleToggleSuscripcion = async (evento) => {
    await toggleSuscripcion(evento);
    if (!isSuscrito(evento.id)) {
      setAnimatingEventId(evento.id);
      setTimeout(() => setAnimatingEventId(null), 1000);
    }
  };

  const navigate = useNavigate();

  return (
    <section className="eventos-disponibles py-3 py-md-5">
      <Container>
        <h2 className="text-center mb-4">Todos Los Eventos</h2>

        {/* Buscador */}
        <Row className="mb-4">
          <Col xs={12} md={6} className="mx-auto">
            <Form className="search-form">
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                <div className="input-group-append">
                  <Button variant="outline-success">
                    <FaSearch />
                  </Button>
                </div>
              </div>
            </Form>
          </Col>
        </Row>

        {/* Categorías */}
        <div className="categories-container mb-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-item ${
                categoriaSeleccionada === category.name ? "selected" : ""
              }`}
              onClick={() =>
                setCategoriaSeleccionada((prev) =>
                  prev === category.name ? null : category.name
                )
              }
              style={{ backgroundColor: category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>

        {/* Lista de eventos */}
        <Row>
          {eventosFiltrados.map((evento) => (
            <Col key={evento.id} xs={12} sm={6} lg={4} className="mb-4">
              <Card
                className={`evento-card h-100 border-success ${
                  evento.cuposDisponibles <= 0 ? "agotado" : ""
                }`}
              >
                <div className="position-relative">
                  <Card.Img variant="top" src={evento.imagen} />
                  <div className="contador-suscripciones">
                    <FaUsers className="text-white me-1" />
                    <strong>{evento.contadorSuscripciones || 0}</strong>
                  </div>
                  {evento.cuposDisponibles <= 0 && (
                    <div className="sello-agotado">
                      <span>Cupos llenos</span>
                    </div>
                  )}
                  <div className="evento-hover-slide">
                    <Button
                      variant="light"
                      className="ver-mas-btn"
                      onClick={() =>
                        navigate(`/evento/${evento.id}`, { state: { evento } })
                      }
                    >
                      Ver más
                    </Button>
                  </div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-success">
                    {evento.nombre}
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    {evento.descripcion}
                  </Card.Text>
                  <div className="evento-detalles mt-3">
                    <p className="evento-fecha mb-1">
                      <FaCalendarAlt className="text-success me-2" />{" "}
                      {evento.fecha} {evento.hora && `- ${evento.hora}`}
                    </p>
                    <p className="evento-categoria mb-1">
                      <FaCode className="text-success me-2" />{" "}
                      {evento.categoria}
                    </p>
                    {evento.lugar && (
                      <p className="evento-lugar mb-1">
                        <FaMapMarkerAlt className="text-success me-2" />{" "}
                        {evento.lugar}
                      </p>
                    )}
                    <p className="cupos-disponibles mb-1">
                      <FaTicketAlt className="text-success me-2" />
                      <strong>{evento.cuposDisponibles}</strong> cupos
                      disponibles
                    </p>
                    {evento.status && (
                      <p className="evento-status mb-1">
                        <FaInfoCircle className="text-success me-2" /> Estado:{" "}
                        {evento.status}
                      </p>
                    )}
                  </div>
                  <div className="button-container mt-3">
                    <Button
                      variant={
                        isSuscrito(evento.id) ? "outline-danger" : "success"
                      }
                      onClick={() => handleToggleSuscripcion(evento)}
                      className={`btn-suscribir w-100 ${
                        isSuscrito(evento.id) ? "btn-cancelar" : ""
                      } ${animatingEventId === evento.id ? "animating" : ""}`}
                      disabled={
                        !isSuscrito(evento.id) && evento.cuposDisponibles <= 0
                      }
                    >
                      {isSuscrito(evento.id)
                        ? "Cancelar Suscripción"
                        : "Suscribirse"}
                    </Button>
                    <Badge
                      bg={evento.cuposDisponibles > 0 ? "success" : "danger"}
                      className="position-absolute top-0 end-0 m-2"
                    >
                      {evento.cuposDisponibles > 0
                        ? `${evento.cuposDisponibles} cupos`
                        : "Agotado"}
                    </Badge>
                  </div>
                  <EncuestaEvento
                    eventoId={evento.id}
                    currentUser={currentUser}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default EventosDisponibles;
