import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import { FaClock, FaMapMarkerAlt, FaSearch, FaArrowLeft, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/ProximosEventos.css";
import { db } from "../config/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const ProximosEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const proximosEventosRef = collection(db, "proximosEventos");
    
    // Obtener eventos iniciales
    getDocs(proximosEventosRef).then((snapshot) => {
      const eventosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEventos(eventosData);
    });

    // Configurar un listener para actualizaciones en tiempo real
    const unsubscribe = onSnapshot(proximosEventosRef, (snapshot) => {
      const eventosActualizados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEventos(eventosActualizados);
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="proximos-eventos-page">
      <Button 
        variant="link" 
        className="btn-volver" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Volver
      </Button>

      <Container>
        <h1 className="text-center mb-5">Próximos Eventos en la UdeC</h1>
        
        <Form className="mb-5">
          <Form.Group as={Row} className="justify-content-center">
            <Col md={6}>
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <Form.Control
                  type="text"
                  placeholder="Busca tu próximo evento..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="search-input"
                />
              </div>
            </Col>
          </Form.Group>
        </Form>

        <div className="timeline-container">
          {eventosFiltrados.map((evento, index) => (
            <div key={evento.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <div className="evento-imagen">
                  <Image src={evento.imagen || 'https://via.placeholder.com/300x200'} alt={evento.nombre} fluid />
                </div>
                <div className="evento-info">
                  <h3 className="evento-titulo">{evento.nombre}</h3>
                  <div className="evento-fecha">{evento.fecha}</div>
                  <div className="evento-detalles">
                    {evento.hora && <p><FaClock /> {evento.hora}</p>}
                    {evento.lugar && <p><FaMapMarkerAlt /> {evento.lugar}</p>}
                    {evento.categoria && <p><FaTag /> {evento.categoria}</p>}
                  </div>
                  <p className="evento-descripcion">{evento.descripcion}</p>
                  <Button variant="outline-success" className="btn-mas-info">Más información</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProximosEventos;
