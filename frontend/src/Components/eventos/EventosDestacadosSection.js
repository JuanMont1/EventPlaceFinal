import React from 'react';
import { Container, Carousel, Button } from "react-bootstrap";

const EventosDestacadosSection = ({ eventosDisponibles, titulo, descripcion }) => (
  <section className="eventos-destacados">
    <Container>
      <h2 className="text-center mb-3">{titulo || "Eventos Destacados"}</h2>
      <p className="text-center mb-4">{descripcion || "Descubre los eventos más emocionantes y populares de nuestra universidad"}</p>
      <Carousel fade controls indicators className="carrusel-container">
        {eventosDisponibles.slice(0, 3).map((evento) => (
          <Carousel.Item key={evento.id}>
            <div className="carrusel-item">
              <div className="carrusel-imagen-container">
                <img
                  className="carrusel-imagen"
                  src={evento.imagen}
                  alt={evento.nombre}
                />
              </div>
              <div className="carrusel-caption">
                <h3>{evento.nombre}</h3>
                <p>{evento.categoria} - {evento.facultad}</p>
                <p className="evento-fecha">{evento.fecha}</p>
                <Button variant="outline-light" className="mt-2">Ver más</Button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  </section>
);

export default EventosDestacadosSection;