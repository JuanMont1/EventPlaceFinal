import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Carousel,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaBullhorn,
  FaArrowRight,
  FaCalendar,
  FaUniversity,
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaPaperPlane,
  FaEnvelope,
  FaComments,
  FaUser,
  FaLightbulb,
  FaHistory,
  FaTools,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/PaginaPrincipal.css";
import CountUp from "react-countup";
import welcomeGif from "../archivos/img/event-academic.gif"; // Usa un gif académico
import L from "leaflet";
import { db } from "../config/firebase";
import { BarraNavegacion } from "../Components/common/BarraNavegacion";
import PieDePagina from "../Components/common/pieDePagina";
import emailjs from "emailjs-com";
import soachaIconImg from "../archivos/img/Punto de marca.png";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-wrapper">
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Container fluid className="hero-container">
          <Row className="align-items-center">
            <Col md={6} className="hero-content">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Bienvenido a EventPlace
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Tu puerta de entrada a experiencias universitarias inolvidables,
                Descubre, participa y crea momentos que definirán tu vida
                universitaria
              </motion.p>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button
                  variant="light"
                  size="lg"
                  className="hero-button"
                  href="/eventos"
                >
                  Mira los eventos anteriores 
                </Button>
              </motion.div>
            </Col>
            <Col md={6} className="hero-gif-container">
              <img
                src={welcomeGif}
                alt="Bienvenida a EventPlace"
                className="hero-gif"
              />
            </Col>
          </Row>
        </Container>
      </motion.section>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-12-31T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="countdown-timer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Proximo Super Evento:</h2>
      <div className="timer">
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="time-segment">
            <span className="time">{value.toString().padStart(2, "0")}</span>
            <span className="label">{key}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

const CampusMap = () => {
  const eventLocation = [4.5787567, -74.2234352];

  const soachaIcon = new L.Icon({
    iconUrl: soachaIconImg,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <div className="campus-map-container">
      <div className="campus-map-content">
        <h2>📍 Ubicación de los eventos</h2>
        <h3>
          Explora en el mapa los espacios donde se llevarán a cabo las
          actividades universitarias más importantes
        </h3>
      </div>
      <div className="campus-map">
        <MapContainer
          center={eventLocation}
          zoom={20}
          scrollWheelZoom={false}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={eventLocation} icon={soachaIcon}>
            <Popup>
              Universidad de Cundinamarca, sede Soacha
              <br />
              Diagonal 9 No. 4B-85, Soacha, Cundinamarca
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

const CampusMapSection = () => {
  return (
    <section className="campus-map-section">
      <CampusMap />
    </section>
  );
};

const EventosDestacados = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent] = useState(null);

  // Estado para los eventos que vienen del backend
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch para obtener los eventos al montar el componente
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/featuredevents"
        );
        if (!response.ok) throw new Error("Error al cargar los eventos");
        const { data } = await response.json();
        setEventos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <motion.section
      className="eventos-destacados-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="eventos-hero">
        <div className="eventos-hero-content">
          <h2>Eventos destacados</h2>
          <p className="eventos-hero-subtitle">
            Descubre las actividades con más inscripciones, seleccionadas por su
            impacto, popularidad y valor para tu crecimiento académico y
            personal. ¡No te las pierdas!
          </p>
        </div>
      </div>
      <div className="eventos-container">
        <div className="eventos-galeria">
          {eventos.map((evento, index) => (
            <motion.div
              key={index}
              className="evento-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="evento-imagen"
                style={{ backgroundImage: `url(${evento.image})` }}
              ></div>
              <div className="evento-contenido">
                <h3>{evento.name}</h3>
                <p>{evento.description}</p>
                <div className="evento-detalles">
                  <p>
                    <FaCalendarAlt /> {evento.date}
                  </p>
                  <p>
                    <FaMapMarkerAlt /> {evento.place}
                  </p>
                  <p>
                    <FaUsers /> Capacidad: {evento.capacity}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedEvent?.description}</p>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                ¿Quieres asistir a este evento? Ingresa tu correo
              </Form.Label>
              <Form.Control type="email" placeholder="tu@email.com" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Registrarme
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.section>
  );
};

const UltimosAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const navigate = useNavigate();

  const handleVerTodosAnuncios = () => {
    navigate("/todos-los-anuncios");
  };

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const anunciosRef = collection(db, "anuncios");
        const q = query(anunciosRef, orderBy("fecha", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        const anunciosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnuncios(anunciosData);
      } catch (error) {
        console.error("Error al obtener anuncios:", error);
      }
    };

    fetchAnuncios();
  }, []);

  const getIcono = (tipo) => {
    switch (tipo) {
      case "evento":
        return <FaBullhorn />;
      case "calendario":
        return <FaCalendarAlt />;
      case "voluntarios":
        return <FaUsers />;
      default:
        return <FaBullhorn />;
    }
  };

  const formatearFecha = (fecha) => {
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString();
    } else if (typeof fecha === "object" && fecha.seconds) {
      // Firestore Timestamp
      return new Date(fecha.seconds * 1000).toLocaleDateString();
    } else if (typeof fecha === "string") {
      // Intenta parsear la fecha si es una cadena
      const parsedDate = new Date(fecha);
      return isNaN(parsedDate.getTime())
        ? fecha
        : parsedDate.toLocaleDateString();
    } else if (typeof fecha === "number") {
      return new Date(fecha).toLocaleDateString();
    }
    return "Fecha no disponible";
  };

  return (
    <section className="ultimos-anuncios">
      <h2>Últimos Anuncios</h2>
      <div className="anuncios-container">
        {anuncios.map((anuncio) => (
          <div key={anuncio.id} className="anuncio-item">
            <div className="anuncio-icono">{getIcono(anuncio.tipo)}</div>
            <div className="anuncio-contenido">
              <h3>{anuncio.titulo}</h3>
              <p>{anuncio.descripcion}</p>
              <span className="anuncio-fecha">
                {formatearFecha(anuncio.fecha)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn-ver-todos-anuncios"
        onClick={handleVerTodosAnuncios}
      >
        Ver todos los anuncios <FaArrowRight />
      </button>
    </section>
  );
};

const EstadisticasEventos = () => {
  const estadisticas = [
    { icono: <FaCalendar />, numero: 20, texto: "Eventos al año", sufijo: "+" },
    {
      icono: <FaUsers />,
      numero: 200,
      texto: "Estudiantes que Participan",
      sufijo: "+",
    },
    {
      icono: <FaUniversity />,
      numero: 5,
      texto: "Apoyos universitarios",
      sufijo: "+",
    },
  ];

  return (
    <section className="estadisticas-eventos">
      <h2 className="estadisticas-titulo">Nuestro Impacto en Números</h2>
      <div className="estadisticas-container">
        {estadisticas.map((stat, index) => (
          <div key={index} className="estadistica-item">
            <div className="estadistica-icono">{stat.icono}</div>
            <div className="estadistica-numero">
              <CountUp
                end={stat.numero}
                duration={2.5}
                separator=","
                suffix={stat.sufijo}
              />
            </div>
            <p className="estadistica-texto">{stat.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const TestimoniosEstudiantes = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        // 1. Obtener todos los eventos
        const eventosSnapshot = await getDocs(collection(db, "eventos"));
        let opiniones = [];
        for (const eventoDoc of eventosSnapshot.docs) {
          // 2. Obtener opiniones de cada evento
          const opinionesSnapshot = await getDocs(
            collection(db, "eventos", eventoDoc.id, "opiniones")
          );
          opiniones = opiniones.concat(
            opinionesSnapshot.docs.map((doc) => ({
              id: doc.id,
              eventoId: eventoDoc.id,
              ...doc.data(),
            }))
          );
        }

        // 3. Obtener usuarios para asociar nombre y carrera
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnapshot.forEach((userDoc) => {
          usersMap[userDoc.id] = userDoc.data();
        });

        // 4. Formatear testimonios
        const testimoniosFormateados = opiniones
          .filter((op) => !!usersMap[op.userId])
          .map((op) => ({
            nombre: usersMap[op.userId]?.name || "Estudiante",
            carrera: usersMap[op.userId]?.carrera || "Carrera no especificada",
            testimonio: op.comentario || "Sin comentario",
            estrellas: Number(op.contenido) || 4,
            imagen: usersMap[op.userId]?.photoURL 
              ? usersMap[op.userId].photoURL
              : "https://randomuser.me/api/portraits/lego/1.jpg",
          }));

        setTestimonios(testimoniosFormateados);
      } catch (error) {
        setTestimonios([]);
      }
    };

    fetchTestimonios();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  if (testimonios.length === 0) {
    return (
      <section className="testimonios-estudiantes">
        <h2>Lo que dicen nuestros estudiantes</h2>
        <p>No hay opiniones disponibles aún.</p>
      </section>
    );
  }

  return (
    <section className="testimonios-estudiantes">
      <h2>Lo que dicen nuestros estudiantes</h2>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={5000}
        pause="hover"
      >
        {testimonios.map((testimonio, idx) => (
          <Carousel.Item key={idx}>
            <Card className="testimonio-card">
              <Card.Body>
                <div className="testimonio-imagen">
                  <img src={testimonio.imagen} alt={testimonio.nombre} />
                </div>
                <blockquote className="blockquote">
                  <FaQuoteLeft className="quote-icon left" />
                  <p>{testimonio.testimonio}</p>
                  <FaQuoteRight className="quote-icon right" />
                </blockquote>
                <footer className="blockquote-footer">
                  <strong>{testimonio.nombre}</strong>, {testimonio.carrera}
                </footer>
                <div className="estrellas">
                  {[...Array(testimonio.estrellas)].map((_, i) => (
                    <FaStar key={i} className="estrella" />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

const PaginaPrincipal = () => {
  return (
    <>
      <div className="pagina-principal">
        <BarraNavegacion />
        <Hero />
        <CountdownTimer />
        <EventosDestacados />
        <CampusMapSection />
        <UltimosAnuncios />
        <EstadisticasEventos />
        <TestimoniosEstudiantes />
      </div>
      <PieDePagina />
    </>
  );
};

export default PaginaPrincipal;
