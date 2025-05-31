import React, { useState, useMemo, useEffect } from "react";
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
} from "react-icons/fa";
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import "../../styles/MisSuscripciones.css";
import { logros } from "../users/logros";

const categories = [
  { id: 1, name: "Académico", icon: <FaGraduationCap />, color: "#4285F4" },
  { id: 2, name: "Cultural", icon: <FaMusic />, color: "#EA4335" },
  { id: 3, name: "Deportivo", icon: <FaFootballBall />, color: "#34A853" },
  { id: 4, name: "Artístico", icon: <FaPalette />, color: "#FBBC05" },
  { id: 5, name: "Tecnológico", icon: <FaCode />, color: "#FF6D01" },
];

const EventosDisponibles = ({
  eventosFiltrados,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  filtro,
  setFiltro,
  isSuscrito,
  toggleSuscripcion,
  contadorEventos,
  eventosDisponibles,
  setEventosDisponibles,
  currentUser,
}) => {
  const [animatingEventId, setAnimatingEventId] = useState(null);
  const [suscripciones, setSuscripciones] = useState([]);

  const eventosToShow = useMemo(() => {
    return eventosDisponibles.filter(
      (e) =>
        (!categoriaSeleccionada || e.categoria === categoriaSeleccionada) &&
        (!filtro || e.nombre.toLowerCase().includes(filtro.toLowerCase()))
    );
  }, [eventosDisponibles, categoriaSeleccionada, filtro]);

  useEffect(() => {
    // Actualizar suscripciones cuando cambian los eventos disponibles
    setSuscripciones(eventosDisponibles.filter(e => isSuscrito(e.id)));
  }, [eventosDisponibles, isSuscrito]);

  useEffect(() => {
    // Verificar logros cada vez que cambian las suscripciones
    checkLogros(suscripciones);
  }, [suscripciones]);

  const checkLogros = async (suscripciones) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const logrosObtenidos = [];

    for (const logro of logros) {
      if (logro.condicion(suscripciones)) {
        logrosObtenidos.push(logro.id);
      }
    }

    if (logrosObtenidos.length > 0) {
      try {
        await updateDoc(userRef, {
          logros: arrayUnion(...logrosObtenidos)
        });
        console.log("Nuevos logros obtenidos:", logrosObtenidos);
      } catch (error) {
        console.error("Error al actualizar logros:", error);
      }
    }
  };

  const handleToggleSuscripcion = async (evento) => {
    await toggleSuscripcion(evento);
    
    // Actualizar el estado local de suscripciones
    setSuscripciones(prev => 
      isSuscrito(evento.id)
        ? [...prev, evento]
        : prev.filter(e => e.id !== evento.id)
    );

    if (!isSuscrito(evento.id)) {
      setAnimatingEventId(evento.id);
      setTimeout(() => setAnimatingEventId(null), 1000);
    }
  };

  return (
    <section className="eventos-disponibles py-5">
      <Container>
        <h2 className="text-center mb-4">Eventos Disponibles</h2>
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
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
        <Row>
          {eventosToShow.map((evento) => (
            <Col key={evento.id} lg={4} md={6} className="mb-4">
              <Card className="evento-card h-100 border-success">
                <Card.Img variant="top" src={evento.imagen} />
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
                      {evento.fecha}
                    </p>
                    <p className="evento-categoria mb-1">
                      <FaCode className="text-success me-2" />{" "}
                      {evento.categoria}
                    </p>
                    <p className="contador-suscripciones mb-1">
                      <FaUsers className="text-success me-2" />
                      <strong>{evento.contadorSuscripciones || 0}</strong>{" "}
                      suscripciones
                    </p>

                    <p className="cupos-disponibles mb-1">
                      <FaTicketAlt className="text-success me-2" />
                      <strong>{evento.cuposDisponibles}</strong> cupos
                      disponibles
                    </p>
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
                </Card.Body>
              </Card>
