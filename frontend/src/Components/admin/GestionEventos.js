import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import AgregarProximoEventoForm from "../admin/AgregarProximoEventoForm";
import AgregarEvento from "../admin/AgregarEvento";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarAlt,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FaStar } from "react-icons/fa";
import ModalEliminarEvento from "../admin/ModalEliminarEvento";
import ModalEditarEvento from "../admin/ModalEditarEvento";
import ModalEditarProximoEvento from "../admin/ModalEditarProximoEvento";

const GestionEventos = () => {
  const [showOpinionesModal, setShowOpinionesModal] = useState(false);
  const [opiniones, setOpiniones] = useState([]);
  const [opinionesConNombre, setOpinionesConNombre] = useState([]);
  const [eventoOpiniones, setEventoOpiniones] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [eventoAEditar, setEventoAEditar] = useState(null);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [contadorEventos, setContadorEventos] = useState({});
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    categoria: "",
    fecha: "",
    hora: "",
    lugar: "",
    descripcion: "",
    imagen: "",
    agenda: [], // Nuevo campo
  });
  const [showEditProximoModal, setShowEditProximoModal] = useState(false);
  const [proximoEventoAEditar, setProximoEventoAEditar] = useState(null);

  const [anuncios, setAnuncios] = useState([]);
  const [nuevoAnuncio, setNuevoAnuncio] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    icono: "faBullhorn",
  });

  const [showSuscritosModal, setShowSuscritosModal] = useState(false);
  const [usuariosSuscritos, setUsuariosSuscritos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [agendaItem, setAgendaItem] = useState({
    hora: "",
    titulo: "",
    ponente: "",
    descripcion: "",
  });

  const fetchEventos = async () => {
    try {
      const eventosSnapshot = await getDocs(collection(db, "eventos"));
      const eventosData = eventosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        cuposDisponibles: doc.data().cuposDisponibles || 0,
      }));
      setEventos(eventosData);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  const fetchProximosEventos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "proximosEventos"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProximosEventos(data);
    } catch (error) {
      console.error("Error al obtener próximos eventos:", error);
    }
  };

  const countSubscriptions = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const counts = {};
    usersSnapshot.forEach((userDoc) => {
      const suscripciones = userDoc.data().suscripciones || [];
      suscripciones.forEach((sub) => {
        counts[sub.id] = (counts[sub.id] || 0) + 1;
      });
    });
    setContadorEventos(counts);
  };

  useEffect(() => {
    fetchEventos();
    fetchProximosEventos();
    countSubscriptions();
    fetchAnuncios();
  }, []);

  const handleEliminar = (evento) => {
    setEventoAEliminar(evento);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = async () => {
    if (eventoAEliminar) {
      try {
        await deleteDoc(doc(db, "eventos", eventoAEliminar.id));
        await eliminarSuscripcionesDeUsuarios(eventoAEliminar.id);
        await fetchEventos();
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  const eliminarSuscripcionesDeUsuarios = async (eventoId) => {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("suscripciones", "array-contains", { id: eventoId })
    );
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      const userRef = doc(db, "users", docSnap.id);
      const nuevasSuscripciones = docSnap
        .data()
        .suscripciones.filter((s) => s.id !== eventoId);
      batch.update(userRef, { suscripciones: nuevasSuscripciones });
    });

    await batch.commit();
  };

  const handleEditar = (evento) => {
    setEventoAEditar({ ...evento });
    setShowEditModal(true);
  };

  const handleEditarChange = (e) => {
    const { name, value } = e.target;
    setEventoAEditar((prev) => ({ ...prev, [name]: value }));
  };

  const confirmarEditar = async () => {
    if (eventoAEditar) {
      try {
        // Crear un objeto con solo los campos que tienen valores definidos
        const camposActualizados = Object.entries(eventoAEditar).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );

        // Asegurarse de que cuposDisponibles sea un número
        if ("cuposDisponibles" in camposActualizados) {
          camposActualizados.cuposDisponibles = Number(
            camposActualizados.cuposDisponibles
          );
        }

        await updateDoc(
          doc(db, "eventos", eventoAEditar.id),
          camposActualizados
        );
        await fetchEventos();
        setShowEditModal(false);
        alert("Evento actualizado con éxito");
      } catch (error) {
        console.error("Error al editar el evento:", error);
        alert(
          "Hubo un error al editar el evento. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const handleNuevoEventoChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProximoEvento = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "proximosEventos"), nuevoEvento);
      setNuevoEvento({
        nombre: "",
        categoria: "",
        fecha: "",
        hora: "",
        lugar: "",
        descripcion: "",
        imagen: "",
      });
      fetchProximosEventos();
      alert("Próximo evento agregado con éxito");
    } catch (error) {
      console.error("Error al agregar próximo evento:", error);
    }
  };

  const handleEditarProximo = (evento) => {
    setProximoEventoAEditar({ ...evento });
    setShowEditProximoModal(true);
  };

  const handleEditarProximoChange = (e) => {
    const { name, value } = e.target;
    setProximoEventoAEditar((prev) => ({ ...prev, [name]: value }));
  };

  const confirmarEditarProximo = async () => {
    if (proximoEventoAEditar) {
      try {
        await updateDoc(doc(db, "proximosEventos", proximoEventoAEditar.id), {
          nombre: proximoEventoAEditar.nombre,
          categoria: proximoEventoAEditar.categoria,
          fecha: proximoEventoAEditar.fecha,
          hora: proximoEventoAEditar.hora,
          lugar: proximoEventoAEditar.lugar,
          descripcion: proximoEventoAEditar.descripcion,
        });
        await fetchProximosEventos();
        setShowEditProximoModal(false);
        alert("Próximo evento actualizado con éxito");
      } catch (error) {
        console.error("Error al editar el próximo evento:", error);
        alert(
          "Hubo un error al editar el próximo evento. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const handleEliminarProximo = async (evento) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar el próximo evento "${evento.nombre}"?`
      )
    ) {
      try {
        await deleteDoc(doc(db, "proximosEventos", evento.id));
        await fetchProximosEventos();
        alert("Próximo evento eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar el próximo evento:", error);
        alert(
          "Hubo un error al eliminar el próximo evento. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  const fetchAnuncios = async () => {
    try {
      const anunciosSnapshot = await getDocs(collection(db, "anuncios"));
      const anunciosData = anunciosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnuncios(anunciosData);
    } catch (error) {
      console.error("Error al obtener anuncios:", error);
    }
  };

  const handleNuevoAnuncioChange = (e) => {
    const { name, value } = e.target;
    setNuevoAnuncio((prev) => ({ ...prev, [name]: value }));
  };

  const agregarNuevoAnuncio = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "anuncios"), {
        ...nuevoAnuncio,
        fecha: new Date().toLocaleDateString(),
      });
      setNuevoAnuncio({
        titulo: "",
        descripcion: "",
        fecha: "",
        icono: "faBullhorn",
      });
      fetchAnuncios();
      alert("Nuevo anuncio agregado con éxito");
    } catch (error) {
      console.error("Error al agregar nuevo anuncio:", error);
    }
  };

  const eliminarAnuncio = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este anuncio?")) {
      try {
        await deleteDoc(doc(db, "anuncios", id));
        fetchAnuncios();
        alert("Anuncio eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar el anuncio:", error);
      }
    }
  };

  const handleVerSuscritos = async (evento) => {
    setEventoSeleccionado(evento);
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("suscripciones", "array-contains", { id: evento.id })
      );
      const querySnapshot = await getDocs(q);
      const usuarios = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuariosSuscritos(usuarios);
      setShowSuscritosModal(true);
    } catch (error) {
      console.error("Error al obtener usuarios suscritos:", error);
    }
  };

  const handleVerOpiniones = async (evento) => {
    setEventoOpiniones(evento);
    setShowOpinionesModal(true);
    try {
      const opinionesSnapshot = await getDocs(
        collection(db, "eventos", evento.id, "opiniones")
      );
      const opinionesData = opinionesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOpiniones(opinionesData);

      // Obtener los nombres de usuario
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersMap = {};
      usersSnapshot.forEach((userDoc) => {
        usersMap[userDoc.id] = userDoc.data();
      });

      const opinionesConNombre = opinionesData.map((op) => ({
        ...op,
        nombreUsuario:
          usersMap[op.userId]?.name || usersMap[op.userId]?.email || op.userId,
        carreraUsuario: usersMap[op.userId]?.carrera || "No especificada",
      }));
      setOpinionesConNombre(opinionesConNombre);
        } catch (error) {
      setOpiniones([]);
      setOpinionesConNombre([]);
      console.error("Error al obtener opiniones:", error);
        }
      };

      const handleAgendaChange = (e) => {
        const { name, value } = e.target;
        setAgendaItem((prev) => ({
      ...prev,
      [name]: value,
        }));
      };

      const handleAddAgendaItem = () => {
        if (!agendaItem.hora || !agendaItem.titulo) return;
        setEventoAEditar((prev) => ({
      ...prev,
      agenda: [...(prev.agenda || []), agendaItem],
        }));
        setAgendaItem({ hora: "", titulo: "", ponente: "", descripcion: "" });
      };

      const handleRemoveAgendaItem = (idx) => {
        setEventoAEditar((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== idx),
        }));
      };

      const handleGuardarAgenda = async () => {
        try {
      await updateDoc(doc(db, "eventos", eventoAEditar.id), {
        agenda: eventoAEditar.agenda,
      });
      setShowAgendaModal(false);
      alert("Agenda guardada con éxito");
      await fetchEventos();
        } catch (e) {
      alert("Error al guardar la agenda");
        }
      };

  const handleVerDetalles = (evento) => {
    setEventoAEditar({ ...evento });
    setShowEditModal(true); // O muestra otro modal de detalles si tienes uno
  };

  return (
    <Container style={{ paddingTop: "250px" }}>
      <h2 className="my-4">Gestión de Eventos</h2>
      <Tabs defaultActiveKey="lista" id="tabs" className="mb-3">
        <Tab eventKey="lista" title="Lista de Eventos">
          <AgregarEvento
            eventos={eventos}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {eventos.map((evento) => (
              <Col key={evento.id}>
                <div className="evento-card admin-card">
                  <div className="contador-suscripciones">
                    <FontAwesomeIcon icon={faUsers} />
                    <strong>{contadorEventos[evento.id] || 0}</strong>
                  </div>
                  <img
                    src={evento.imagen}
                    className="card-img-top"
                    alt={evento.nombre}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{evento.nombre}</h5>
                    <p className="evento-fecha">
                      <FontAwesomeIcon icon={faCalendarAlt} /> {evento.fecha}
                    </p>
                    <span className="evento-categoria">
                      <FontAwesomeIcon icon={faTag} /> {evento.categoria}
                    </span>
                    <p className="card-text">{evento.descripcion}</p>
                    <p className="cupos-disponibles">
                      Cupos disponibles: {evento.cuposDisponibles}
                    </p>
                    <div className="button-container mt-2">
                      <Button
                        variant="primary"
                        onClick={() => handleEditar(evento)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminar(evento)}
                      >
                        Eliminar
                      </Button>
                     
                      <Button
                        variant="secondary"
                        onClick={() => handleVerOpiniones(evento)}
                      >
                        Ver Opiniones
                      </Button>
                      <Button
                        variant="light"
                        onClick={() => {
                          setEventoAEditar({ ...evento });
                          setShowAgendaModal(true);
                        }}
                      >
                        Agregar Agenda
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="proximos" title="Próximos Eventos">
          <h3>Agregar Próximo Evento</h3>
          <AgregarProximoEventoForm
            nuevoEvento={nuevoEvento}
            handleNuevoEventoChange={handleNuevoEventoChange}
            agregarProximoEvento={agregarProximoEvento}
          />

          <h3 className="mt-4">Lista de Próximos Eventos</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proximosEventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.nombre}</td>
                  <td>{evento.fecha}</td>
                  <td>{evento.hora}</td>
                  <td>{evento.lugar}</td>
                  <td>{evento.categoria}</td>
                  <td>{evento.descripcion}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditarProximo(evento)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarProximo(evento)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="anuncios" title="Últimos Anuncios">
          <h3>Agregar Nuevo Anuncio</h3>
          <Form onSubmit={agregarNuevoAnuncio}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={nuevoAnuncio.titulo}
                onChange={handleNuevoAnuncioChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={nuevoAnuncio.descripcion}
                onChange={handleNuevoAnuncioChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Icono</Form.Label>
              <Form.Select
                name="icono"
                value={nuevoAnuncio.icono}
                onChange={handleNuevoAnuncioChange}
              >
                <option value="faBullhorn">Megáfono</option>
                <option value="faCalendarAlt">Calendario</option>
                <option value="faUsers">Usuarios</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit">Agregar Anuncio</Button>
          </Form>

          <h3 className="mt-4">Lista de Anuncios</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {anuncios.map((anuncio) => (
                <tr key={anuncio.id}>
                  <td>{anuncio.titulo}</td>
                  <td>{anuncio.descripcion}</td>
                  <td>{anuncio.fecha}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarAnuncio(anuncio.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      <ModalEliminarEvento
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        eventoAEliminar={eventoAEliminar}
        onConfirm={confirmarEliminar}
      />

      <ModalEditarEvento
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        eventoAEditar={eventoAEditar}
        handleEditarChange={handleEditarChange}
        onConfirm={confirmarEditar}
      />

      <ModalEditarProximoEvento
        show={showEditProximoModal}
        onHide={() => setShowEditProximoModal(false)}
        proximoEventoAEditar={proximoEventoAEditar}
        handleEditarProximoChange={handleEditarProximoChange}
        onConfirm={confirmarEditarProximo}
      />

      {/* Modal para mostrar usuarios suscritos */}
      <Modal
        show={showSuscritosModal}
        onHide={() => setShowSuscritosModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Usuarios Suscritos - {eventoSeleccionado?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuariosSuscritos.length > 0 ? (
            <ul>
              {usuariosSuscritos.map((usuario) => (
                <li key={usuario.id}>
                  {usuario.name} - {usuario.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay usuarios suscritos a este evento.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSuscritosModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showOpinionesModal}
        onHide={() => setShowOpinionesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Opiniones - {eventoOpiniones?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {opinionesConNombre.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Carrera</th>
                  <th>Contenido</th>
                  <th>Organización</th>
                  <th>Instalaciones</th>
                  <th>Recomendación</th>
                  <th>Comentario</th>
                </tr>
              </thead>
              <tbody>
                {opinionesConNombre.map((op) => (
                  <tr key={op.id}>
                    <td>{op.nombreUsuario}</td>
                    <td>{op.carreraUsuario}</td>
                    <td>
                      {op.contenido} <FaStar color="#fbc02d" />
                    </td>
                    <td>
                      {op.organizacion} <FaStar color="#fbc02d" />
                    </td>
                    <td>
                      {op.instalaciones} <FaStar color="#fbc02d" />
                    </td>
                    <td>
                      {op.recomendacion === 5
                        ? "Sí"
                        : op.recomendacion === 3
                        ? "Tal vez"
                        : "No"}
                    </td>
                    <td>{op.comentario}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay opiniones para este evento.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOpinionesModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAgendaModal} onHide={() => setShowAgendaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar/Editar Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-4">
            <Form.Label>Agregar ítem a la agenda</Form.Label>
            <Row className="g-2 align-items-end">
              <Col md={3}>
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
            </Row>
            <Button
              variant="success"
              className="mt-2"
              type="button"
              onClick={handleAddAgendaItem}
            >
              +
            </Button>
            {/* Lista de agenda agregada */}
            {eventoAEditar?.agenda?.length > 0 && (
              <div className="mt-3">
                {eventoAEditar.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 6,
                      padding: 8,
                      marginBottom: 8,
                    }}
                  >
                    <strong>{item.hora}</strong> |{" "}
                    <strong>{item.titulo}</strong>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAgendaModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarAgenda}>
            Guardar Agenda
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GestionEventos;
