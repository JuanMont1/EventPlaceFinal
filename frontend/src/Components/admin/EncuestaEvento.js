import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const EncuestaEvento = ({ eventoId, currentUser }) => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    contenido: "",
    organizacion: "",
    instalaciones: "",
    recomendacion: "",
    comentario: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "eventos", eventoId, "opiniones"), {
        userId: currentUser?.uid || "anon",
        ...form,
        contenido: Number(form.contenido),
        organizacion: Number(form.organizacion),
        instalaciones: Number(form.instalaciones),
        recomendacion: Number(form.recomendacion),
        timestamp: new Date(),
      });
      setForm({
        contenido: "",
        organizacion: "",
        instalaciones: "",
        recomendacion: "",
        comentario: "",
      });
      setShow(false);
      alert("¡Gracias por tu opinión!");
    } catch (error) {
      alert("Error al enviar la opinión");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-3">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => setShow(true)}
        className="w-100"
      >
        Calificar evento
      </Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Califica este evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Calidad del contenido</Form.Label>
              <Form.Select
                name="contenido"
                value={form.contenido}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Organización del evento</Form.Label>
              <Form.Select
                name="organizacion"
                value={form.organizacion}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Instalaciones</Form.Label>
              <Form.Select
                name="instalaciones"
                value={form.instalaciones}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>¿Recomendarías este evento?</Form.Label>
              <Form.Select
                name="recomendacion"
                value={form.recomendacion}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="5">Sí, totalmente</option>
                <option value="3">Tal vez</option>
                <option value="1">No</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Comentario adicional</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="comentario"
                value={form.comentario}
                onChange={handleChange}
                placeholder="¿Algo más que quieras compartir?"
              />
            </Form.Group>
            <Button
              className="mt-3"
              variant="primary"
              size="sm"
              type="submit"
              disabled={submitting}
            >
              Enviar opinión
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EncuestaEvento;