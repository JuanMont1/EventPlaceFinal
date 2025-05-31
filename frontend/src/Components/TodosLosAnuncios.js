import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaBullhorn, FaCalendarAlt, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/TodosLosAnuncios.css';

const TodosLosAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const anunciosRef = collection(db, 'anuncios');
        const q = query(anunciosRef, orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);
        const anunciosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
      case 'evento': return <FaBullhorn />;
      case 'calendario': return <FaCalendarAlt />;
      case 'voluntarios': return <FaUsers />;
      default: return <FaBullhorn />;
    }
  };

  const formatearFecha = (fecha) => {
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString();
    } else if (typeof fecha === 'object' && fecha.seconds) {
      return new Date(fecha.seconds * 1000).toLocaleDateString();
    } else if (typeof fecha === 'string') {
      const parsedDate = new Date(fecha);
      return isNaN(parsedDate.getTime()) ? fecha : parsedDate.toLocaleDateString();
    } else if (typeof fecha === 'number') {
      return new Date(fecha).toLocaleDateString();
    }
    return 'Fecha no disponible';
  };

  return (
    <div className="todos-los-anuncios">
      <div className="anuncios-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>
        <h1>Todos los Anuncios</h1>
      </div>
      <div className="anuncios-container">
        <div className="anuncios-grid">
          {anuncios.map((anuncio) => (
            <div key={anuncio.id} className="anuncio-card">
              <div className="anuncio-icono">{getIcono(anuncio.tipo)}</div>
              <div className="anuncio-contenido">
                <h3>{anuncio.titulo}</h3>
                <p>{anuncio.descripcion}</p>
                <span className="anuncio-fecha">{formatearFecha(anuncio.fecha)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodosLosAnuncios;