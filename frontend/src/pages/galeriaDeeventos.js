import React, { useState, useEffect } from 'react';
import {BarraNavegacion} from '../Components/common/BarraNavegacion';
import PieDePagina from '../Components/common/pieDePagina';

import '../styles/GaleriaEventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/galleryevents');
        if (!response.ok) throw new Error('Error al obtener eventos');
        const { data } = await response.json();
        setEventos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEventos();
  }, []);


  const eventosFiltrados = filtroCategoria === 'Todos'
    ? eventos
    : eventos.filter(evento => evento.category === filtroCategoria);


  return (
    <div className="galeria-eventos">
      <h1 className="galeria-titulo">Galería de Eventos Pasados</h1>
      <p className="galeria-descripcion">
        Explora nuestra colección de eventos memorables que han dado forma a nuestra comunidad a lo largo del tiempo.
      </p>
      
      <div className="filtros-container">
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="filtro-select"
        >
          <option value="Todos">Todos los eventos</option>
          <option value="Académico">Académicos</option>
          <option value="Cultural">Culturales</option>
          <option value="Deportivo">Deportivos</option>
          <option value="Artístico">Artístico</option>
          <option value="Tecnológico">Tecnológico</option>
        </select>
      </div>

      <div className="eventos-grid">
        {eventosFiltrados.map(evento => (
          <div key={evento.name} className="evento-card">
            <img src={evento.image} alt={evento.name} className="evento-imagen" />
            <div className="evento-info">
              <h3 className="evento-titulo">{evento.name}</h3>
              <p className="evento-fecha">{evento.date}</p>
              <p className="evento-categoria">{evento.category}</p>
              <p className="evento-descripcion">{evento.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GaleriaEventos = () => {
  return (
    <>
      <BarraNavegacion/>
      <div className='contenedor'>
        <Eventos/>
      </div>
      <PieDePagina/>
    </>
  )
};

export default GaleriaEventos;