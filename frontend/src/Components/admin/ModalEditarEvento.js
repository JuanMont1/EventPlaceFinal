import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const ModalEditarEvento = ({ show, onHide, eventoAEditar, handleEditarChange, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={eventoAEditar?.nombre || ""}
                  onChange={handleEditarChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="text"
                  name="categoria"
                  value={eventoAEditar?.categoria || ""}
                  onChange={handleEditarChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={eventoAEditar?.fecha || ""}
                  onChange={handleEditarChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  name="hora"
                  value={eventoAEditar?.hora || ""}
                  onChange={handleEditarChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Control
              type="text"
              name="lugar"
              value={eventoAEditar?.lugar || ""}
              onChange={handleEditarChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={eventoAEditar?.descripcion || ""}
              onChange={handleEditarChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL de la Imagen</Form.Label>
            <Form.Control
              type="url"
              name="imagen"
              value={eventoAEditar?.imagen || ""}
              onChange={handleEditarChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cupos Disponibles</Form.Label>
            <Form.Control
              type="number"
              name="cuposDisponibles"
              value={eventoAEditar?.cuposDisponibles || 0}
              onChange={handleEditarChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarEvento;