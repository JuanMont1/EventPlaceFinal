import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const DetalleEvento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Recibe los datos del evento desde la navegación
  const evento = location.state?.evento;

  if (!evento) {
    return (
      <Container className="py-5">
        <h2>No se encontró el evento.</h2>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col md={6}>
          <img
            src={evento.imagen}
            alt={evento.nombre}
            style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
          />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h2>{evento.nombre}</h2>
          <p>{evento.descripcion}</p>
          <div>
            <strong>Fecha:</strong> {evento.fecha} {evento.hora && `- ${evento.hora}`}
          </div>
          <div>
            <strong>Lugar:</strong> {evento.lugar}
          </div>
        </Col>
      </Row>

      {/* Agenda del evento */}
      <Card className="p-4" style={{ border: "2px solid #d50000", borderRadius: "8px" }}>
        <h3 className="text-center mb-4" style={{ fontWeight: 700, color: "#333" }}>
          Agenda del evento
        </h3>
        {evento.agenda && evento.agenda.length > 0 ? (
          evento.agenda.map((item, idx) => (
            <div key={idx}>
              <div style={{ color: "#d50000", fontWeight: 600, marginBottom: 4 }}>
                {item.hora} | {item.titulo}
              </div>
              {item.ponente && (
                <div style={{ fontWeight: 700 }}>{item.ponente}</div>
              )}
              {item.descripcion && (
                <div style={{ color: "#555", marginBottom: 8 }}>{item.descripcion}</div>
              )}
              {idx !== evento.agenda.length - 1 && (
                <hr style={{ borderTop: "1px solid #ccc" }} />
              )}
            </div>
          ))
        ) : (
          <p>No hay agenda disponible.</p>
        )}
      </Card>
    </Container>
  );
};

export default DetalleEvento;