import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/MisSuscripciones.css";
import { BarraNavegacion } from "../Components/common/BarraNavegacion";
import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import EventosDisponibles from "../Components/eventos/EventosDisponibles";
import PieDePagina from "../Components/common/pieDePagina";
import EventosDestacadosSection from "../Components/eventos/EventosDestacadosSection";
import VideoPromoSection from "../Components/eventos/VideoPromoSection";

const MisSuscripciones = () => {
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [user, setUser] = useState(null);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const eventosDisponiblesRef = React.useRef(null);

  const BienvenidaSection = () => (
    <section className="bienvenida">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-4 fw-bold">
              ¡Gracias por unirte a EventPlace!
            </h1>
            <p className="lead">
              Descubre y suscríbete a los mejores eventos de la Universidad de
              Cundinamarca. No te pierdas ninguna oportunidad de aprender,
              crecer y divertirte.
            </p>
            <Button
              variant="success"
              size="lg"
              className="rounded-pill px-4 py-2"
              onClick={() => {
                if (eventosDisponiblesRef.current) {
                  eventosDisponiblesRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                  setMostrarMensaje(true);
                  setTimeout(() => setMostrarMensaje(false), 2500);
                }
              }}
            >
              Explorar Eventos
            </Button>
          </Col>
          <Col md={6}>
            <div className="imagen-container">
              <img
                src="https://noticias.udec.cl/wp-content/uploads/2022/09/CADEC-06-1024x683.jpg"
                alt="Eventos Universitarios"
                className="imagen-eventos"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const verificarEventosExistentes = useCallback(async (suscripciones) => {
    const eventosExistentes = await Promise.all(
      suscripciones.map(async (evento) => {
        const eventoRef = doc(db, "eventos", evento.id);
        const eventoDoc = await getDoc(eventoRef);
        return eventoDoc.exists() ? evento : null;
      })
    );
    return eventosExistentes.filter((evento) => evento !== null);
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventosCollection = collection(db, "eventos");
        const eventosSnapshot = await getDocs(eventosCollection);
        const eventosData = eventosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          contadorSuscripciones: Object.keys(doc.data().suscripciones || {})
            .length,
        }));
        setEventosDisponibles(eventosData);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, async (doc) => {
          if (doc.exists()) {
            const userSuscripciones = doc.data().suscripciones || [];
            const suscripcionesActualizadas = await verificarEventosExistentes(
              userSuscripciones
            );

            // Si hay diferencias, actualizar el documento del usuario
            if (suscripcionesActualizadas.length !== userSuscripciones.length) {
              await updateDoc(userRef, {
                suscripciones: suscripcionesActualizadas,
              });
            }

            setSuscripciones(suscripcionesActualizadas);
            console.log(
              "Suscripciones actualizadas:",
              suscripcionesActualizadas
            );
          } else {
            setSuscripciones([]);
          }
        });
        return () => unsubscribeUser();
      } else {
        setSuscripciones([]);
      }
    });

    return () => unsubscribe();
  }, [verificarEventosExistentes]);

  const toggleSuscripcion = useCallback(
    async (evento) => {
      if (!user) {
        alert("Por favor, inicia sesión para suscribirte a eventos.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const eventoRef = doc(db, "eventos", evento.id);

      try {
        const eventoDoc = await getDoc(eventoRef);
        const eventoData = eventoDoc.data();
        const suscripcionesEvento = eventoData.suscripciones || {};
        let newSuscripciones;
        let cuposIncrement;

        if (suscripcionesEvento[user.uid]) {
          // Cancelar suscripción
          delete suscripcionesEvento[user.uid];
          newSuscripciones = suscripciones.filter((e) => e.id !== evento.id);
          cuposIncrement = 1;
        } else {
          // Suscribirse
          if (eventoData.cuposDisponibles <= 0) {
            alert("Lo sentimos, no hay cupos disponibles para este evento.");
            return;
          }
          suscripcionesEvento[user.uid] = true;
          newSuscripciones = [...suscripciones, evento];
          cuposIncrement = -1;
        }

        await updateDoc(userRef, { suscripciones: newSuscripciones });
        await updateDoc(eventoRef, {
          suscripciones: suscripcionesEvento,
          cuposDisponibles: eventoData.cuposDisponibles + cuposIncrement,
        });

        // Actualizar estados locales
        setSuscripciones(newSuscripciones);
        setEventosDisponibles((prevEventos) =>
          prevEventos.map((e) =>
            e.id === evento.id
              ? {
                  ...e,
                  cuposDisponibles: e.cuposDisponibles + cuposIncrement,
                  contadorSuscripciones:
                    Object.keys(suscripcionesEvento).length,
                }
              : e
          )
        );
      } catch (err) {
        console.error("Error al actualizar suscripciones:", err);
        alert(
          "Error al actualizar suscripciones. Por favor, inténtalo de nuevo."
        );
      }
    },
    [user, suscripciones, setEventosDisponibles]
  );

  const eventosFiltrados = useMemo(() => {
    return eventosDisponibles.filter(
      (evento) =>
        (categoriaSeleccionada
          ? evento.categoria === categoriaSeleccionada
          : true) &&
        (evento.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
          evento.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
          evento.facultad.toLowerCase().includes(filtro.toLowerCase()))
    );
  }, [eventosDisponibles, categoriaSeleccionada, filtro]);

  const isSuscrito = useCallback(
    (eventoId) => {
      return suscripciones.some((e) => e.id === eventoId);
    },
    [suscripciones]
  );

  const eventosDestacados = useMemo(() => {
    return [...eventosDisponibles]
      .sort(
        (a, b) =>
          (b.contadorSuscripciones || 0) - (a.contadorSuscripciones || 0)
      )
      .slice(0, 5);
  }, [eventosDisponibles]);

  return (
    <div>
      <BarraNavegacion />

      <BienvenidaSection />

      <EventosDestacadosSection
        eventosDisponibles={eventosDestacados}
        titulo="Eventos Destacados"
        descripcion="Descubre los eventos más emocionantes y populares de nuestra universidad"
      />

      <div ref={eventosDisponiblesRef} />
      {mostrarMensaje && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(76, 175, 80, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontWeight: "bold",
            fontSize: "2rem",
            color: "#fff",
            transition: "opacity 0.5s",
            backdropFilter: "blur(2px)",
          }}
        >
          <span
            role="img"
            aria-label="smile"
            style={{ fontSize: "2.5rem", marginRight: "1rem" }}
          >
            😊
          </span>
          ¡Acá te suscribirás!
        </div>
      )}

      <EventosDisponibles
        eventosFiltrados={eventosFiltrados}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        filtro={filtro}
        setFiltro={setFiltro}
        isSuscrito={isSuscrito}
        toggleSuscripcion={toggleSuscripcion}
        eventosDisponibles={eventosDisponibles}
        setEventosDisponibles={setEventosDisponibles}
        currentUser={user}
      />

      <VideoPromoSection />

      <PieDePagina />
    </div>
  );
};

export default MisSuscripciones;
