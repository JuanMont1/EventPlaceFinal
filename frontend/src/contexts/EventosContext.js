import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';

const EventosContext = createContext();

export const useEventos = () => useContext(EventosContext);

export const EventosProvider = ({ children }) => {
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(setUser);

    const unsubscribeEventos = onSnapshot(collection(db, 'eventos'), (snapshot) => {
      const eventos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventosDisponibles(eventos);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeEventos();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setSuscripciones(doc.data().suscripciones || []);
      }
    });

    return () => unsubscribeUser();
  }, [user]);

  const toggleSuscripcion = async (evento) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const eventoRef = doc(db, 'eventos', evento.id);

    const userDoc = await getDoc(userRef);
    const eventoDoc = await getDoc(eventoRef);

    const userSuscripciones = userDoc.data().suscripciones || [];
    const eventoSuscripciones = eventoDoc.data().suscripciones || {};

    const isSuscrito = userSuscripciones.some(e => e.id === evento.id);

    if (isSuscrito) {
      // Cancelar suscripción
      await updateDoc(userRef, {
        suscripciones: userSuscripciones.filter(e => e.id !== evento.id)
      });
      delete eventoSuscripciones[user.uid];
      await updateDoc(eventoRef, {
        suscripciones: eventoSuscripciones,
        cuposDisponibles: eventoDoc.data().cuposDisponibles + 1
      });
    } else {
      // Suscribirse
      if (eventoDoc.data().cuposDisponibles <= 0) {
        throw new Error('No hay cupos disponibles');
      }
      await updateDoc(userRef, {
        suscripciones: [...userSuscripciones, evento]
      });
      eventoSuscripciones[user.uid] = true;
      await updateDoc(eventoRef, {
        suscripciones: eventoSuscripciones,
        cuposDisponibles: eventoDoc.data().cuposDisponibles - 1
      });
    }
  };

  const getRecomendaciones = (intereses, suscripciones) => {
    return eventosDisponibles.filter(evento => 
      intereses.includes(evento.categoria) && !suscripciones.some(s => s.id === evento.id)
    ).slice(0, 3);
  };

  return (
    <EventosContext.Provider value={{
      eventosDisponibles,
      suscripciones,
      toggleSuscripcion,
      user,
      getRecomendaciones,
    }}>
      {children}
    </EventosContext.Provider>
  );
};