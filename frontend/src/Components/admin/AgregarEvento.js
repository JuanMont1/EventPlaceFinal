import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from '../../config/firebase';
import { guardarEventoPasado } from '../../services/eventosService';

const AgregarEvento = () => {
  const [evento, setEvento] = useState({
    nombre: "",
    categoria: "",
    fecha: "",
    facultad: "",
    imagen: "",
    descripcion: "",
    cuposDisponibles: 0,
    agenda: [], // Nuevo campo para la agenda
  });
  const [agendaItem, setAgendaItem] = useState({
    hora: "",
    titulo: "",
    ponente: "",
    descripcion: "",
  });
  const navigate = useNavigate();

  const { nombre, categoria, fecha, facultad, imagen, descripcion, cuposDisponibles, agenda } = evento;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento((prevEvento) => ({
      ...prevEvento,
      [name]: name === "cuposDisponibles" ? parseInt(value, 10) : value,
    }));
  };

  // Manejo de la agenda
  const handleAgendaChange = (e) => {
    const { name, value } = e.target;
    setAgendaItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAgendaItem = () => {
    if (!agendaItem.hora || !agendaItem.titulo) return;
    setEvento((prevEvento) => ({
      ...prevEvento,
      agenda: [...prevEvento.agenda, agendaItem],
    }));
    setAgendaItem({
      hora: "",
      titulo: "",
      ponente: "",
      descripcion: "",
    });
  };

  const handleRemoveAgendaItem = (idx) => {
    setEvento((prevEvento) => ({
      ...prevEvento,
      agenda: prevEvento.agenda.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const eventoParaGuardar = {
        ...evento,
        cuposDisponibles: parseInt(evento.cuposDisponibles, 10),
        fechaCreacion: new Date(),
      };

      const docRef = await addDoc(collection(db, "eventos"), eventoParaGuardar);
      console.log("Evento agregado con ID: ", docRef.id);

      // Guardar en eventos pasados
      await guardarEventoPasado({ ...eventoParaGuardar, id: docRef.id });

      alert("Evento agregado con éxito");
      navigate("/admin/eventos");
    } catch (e) {
      console.error("Error al agregar el evento: ", e);
      alert("Error al agregar el evento. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div style={{ paddingBottom: "24px" }}>
      <Container>
        <h2 className="my-4">Agregar Nuevo Evento</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Evento</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="categoria"
                  value={categoria}
                  onChange={handleChange}
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={fecha}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Facultad</Form.Label>
                <Form.Control
                  type="text"
                  name="facultad"
                  value={facultad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>URL de la Imagen del Evento</Form.Label>
            <Form.Control
              type="url"
              name="imagen"
              value={imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={descripcion}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cupos Disponibles</Form.Label>
            <Form.Control
              type="number"
              name="cuposDisponibles"
              value={cuposDisponibles}
              onChange={handleChange}
              min="0"
              required
            />
          </Form.Group>

          {/* Agenda del evento */}
          <Form.Group className="mb-4">
            <Form.Label>Agenda del Evento</Form.Label>
            <Row className="g-2 align-items-end">
              <Col md={2}>
                <Form.Control
                  type="text"
                  name="hora"
                  placeholder="Hora"
                  value={agendaItem.hora}
                  onChange={handleAgendaChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="titulo"
                  placeholder="Título"
                  value={agendaItem.titulo}
                  onChange={handleAgendaChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="ponente"
                  placeholder="Ponente"
                  value={agendaItem.ponente}
                  onChange={handleAgendaChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  value={agendaItem.descripcion}
                  onChange={handleAgendaChange}
                />
              </Col>
              <Col md={1}>
                <Button variant="success" type="button" onClick={handleAddAgendaItem}>
                  +
                </Button>
              </Col>
            </Row>
            {/* Lista de agenda agregada */}
            {agenda.length > 0 && (
              <div className="mt-3">
                {agenda.map((item, idx) => (
                  <div key={idx} style={{ border: "1px solid #eee", borderRadius: 6, padding: 8, marginBottom: 8 }}>
                    <strong>{item.hora}</strong> | <strong>{item.titulo}</strong>
                    {item.ponente && <span> - {item.ponente}</span>}
                    <div style={{ color: "#555" }}>{item.descripcion}</div>
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-1"
                      onClick={() => handleRemoveAgendaItem(idx)}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Agregar Evento
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AgregarEvento;