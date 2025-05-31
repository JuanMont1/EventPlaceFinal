import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, setDoc, updateDoc, increment } from "firebase/firestore";

const SuscripcionesContext = createContext();

export const useSuscripciones = () => useContext(SuscripcionesContext);

export const SuscripcionesProvider = ({ children }) => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [contadorEventos, setContadorEventos] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setSuscripciones([]);
        setContadorEventos({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const unsubscribeUser = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setSuscripciones(doc.data().suscripciones || []);
        } else {
          setDoc(userRef, { suscripciones: [] });
          setSuscripciones([]);
        }
        setLoading(false);
      }, (err) => {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
        setLoading(false);
      });

      const contadorRef = doc(db, "contadores", "eventos");
      const unsubscribeContador = onSnapshot(contadorRef, (doc) => {
        if (doc.exists()) {
          setContadorEventos(doc.data());
        } else {
          setDoc(contadorRef, {});
        }
      }, (err) => {
        console.error("Error fetching contador data:", err);
        setError("Error al cargar los contadores de eventos");
      });

      return () => {
        unsubscribeUser();
        unsubscribeContador();
      };
    } catch (err) {
      console.error("Error in fetchUserData:", err);
      setError("Error al cargar los datos del usuario");
      setLoading(false);
    }
  };

  const toggleSuscripcion = async (evento) => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const contadorRef = doc(db, "contadores", "eventos");

    try {
      let newSuscripciones;
      let contadorIncrement;

      if (suscripciones.some(e => e.id === evento.id)) {
        // Cancelar suscripción
        newSuscripciones = suscripciones.filter(e => e.id !== evento.id);
        contadorIncrement = -1;
      } else {
        // Suscribirse
        newSuscripciones = [...suscripciones, evento];
        contadorIncrement = 1;
      }

      await updateDoc(userRef, { suscripciones: newSuscripciones });
      await updateDoc(contadorRef, { [evento.id]: increment(contadorIncrement) });

      // Actualizar el estado local
      setSuscripciones(newSuscripciones);
      setContadorEventos(prev => ({
        ...prev,
        [evento.id]: (prev[evento.id] || 0) + contadorIncrement
      }));

      setError(null); // Limpiar cualquier error previo
    } catch (err) {
      console.error("Error al actualizar suscripciones:", err);
      setError("Error al actualizar suscripciones");
      throw err; // Re-lanza el error para manejarlo en el componente
    }
  };

  return (
    <SuscripcionesContext.Provider value={{ suscripciones, contadorEventos, toggleSuscripcion, loading, error, setError }}>
      {children}
    </SuscripcionesContext.Provider>
  );
};