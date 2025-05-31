import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AgregarProximoEventoForm = ({
  nuevoEvento,
  handleNuevoEventoChange,
  agregarProximoEvento,
}) => {
  return (
    <Form onSubmit={agregarProximoEvento}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Evento</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoEvento.nombre}
              onChange={handleNuevoEventoChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={nuevoEvento.categoria}
              onChange={handleNuevoEventoChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Académico">Académico</option>
              <option value="Cultural">Cultural</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Artístico">Artístico</option>
              <option value="Tecnológico">Tecnológico</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={nuevoEvento.fecha}
              onChange={handleNuevoEventoChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              value={nuevoEvento.hora}
              onChange={handleNuevoEventoChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Control
              type="text"
              name="lugar"
              value={nuevoEvento.lugar}
              onChange={handleNuevoEventoChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcion"
          value={nuevoEvento.descripcion}
          onChange={handleNuevoEventoChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL de la Imagen</Form.Label>
        <Form.Control
          type="url"
          name="imagen"
          value={nuevoEvento.imagen}
          onChange={handleNuevoEventoChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        <FontAwesomeIcon icon={faPlus} /> Agregar Próximo Evento
      </Button>
    </Form>
  );
};

export default AgregarProximoEventoForm;
