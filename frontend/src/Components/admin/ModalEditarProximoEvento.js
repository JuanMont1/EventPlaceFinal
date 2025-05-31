import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEditarProximoEvento = ({ show, onHide, proximoEventoAEditar, handleEditarProximoChange, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Próximo Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={proximoEventoAEditar?.nombre || ""}
              onChange={handleEditarProximoChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              name="categoria"
              value={proximoEventoAEditar?.categoria || ""}
              onChange={handleEditarProximoChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={proximoEventoAEditar?.fecha || ""}
              onChange={handleEditarProximoChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              value={proximoEventoAEditar?.hora || ""}
              onChange={handleEditarProximoChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lugar</Form.Label>
            <Form.Control
              type="text"
              name="lugar"
              value={proximoEventoAEditar?.lugar || ""}
              onChange={handleEditarProximoChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={proximoEventoAEditar?.descripcion || ""}
              onChange={handleEditarProximoChange}
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

export default ModalEditarProximoEvento;