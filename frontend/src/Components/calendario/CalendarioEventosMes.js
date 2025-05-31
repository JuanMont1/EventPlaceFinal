import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/CalendarioEventosMes.css"; 

const eventos = [
  {
    fecha: "16",
    mes: "APRIL",
    color: "#00b894",
    titulo: "Movilidad académica estudiantil",
    descripcion: "Cronograma de socialización",
    lugar: "Facatativá",
    colorLugar: "#009e60",
  },
  {
    fecha: "17",
    mes: "APRIL",
    color: "#00bcd4",
    titulo: "Torneo de entidades públicas y privadas",
    descripcion: "Fútbol masculino Ucundinamarca",
    lugar: "Fusagasugá",
    colorLugar: "#00bcd4",
  },
  {
    fecha: "17",
    mes: "APRIL",
    color: "#757575",
    titulo: "Open Day",
    descripcion: "Convocatoria LATAM 2024-2 virtual",
    lugar: "Virtual",
    colorLugar: "#757575",
  },
  {
    fecha: "18",
    mes: "APRIL",
    color: "#00bcd4",
    titulo: "Movilidad académica estudiantil",
    descripcion: "Cronograma de socialización",
    lugar: "Fusagasugá",
    colorLugar: "#00bcd4",
  },
  {
    fecha: "19",
    mes: "APRIL",
    color: "#8bc34a",
    titulo: "Fútbol para todos",
    descripcion: "Juego adaptado y actividad sin límite.",
    lugar: "Soacha",
    colorLugar: "#8bc34a",
  },
  {
    fecha: "19",
    mes: "APRIL",
    color: "#ffc107",
    titulo: "Open Day",
    descripcion: "Convocatoria LATAM 2024-2 virtual",
    lugar: "Girardot",
    colorLugar: "#ffc107",
  },
  {
    fecha: "22",
    mes: "APRIL",
    color: "#00695c",
    titulo: "Movilidad académica estudiantil",
    descripcion: "Cronograma de socialización",
    lugar: "Ubaté",
    colorLugar: "#00695c",
  },
  {
    fecha: "28",
    mes: "APRIL",
    color: "#00bcd4",
    titulo: "Copa regional de Voleibol",
    descripcion: "UCundinamarca",
    lugar: "Fusagasugá",
    colorLugar: "#00bcd4",
  },
];

const splitEventos = [
  eventos.slice(0, 4),
  eventos.slice(4, 8),
];

const CalendarioEventosMes = () => (
  <section className="calendario-mes-section">
    <h2 className="calendario-mes-title">CALENDARIO EVENTOS GENERALES</h2>
    <div className="calendario-mes-box">
      {splitEventos.map((col, idx) => (
        <div className="calendario-mes-col" key={idx}>
          {col.map((ev, i) => (
            <div className="calendario-mes-evento" key={i}>
              <div className="calendario-mes-fecha" style={{ borderColor: ev.color }}>
                <div className="calendario-mes-fecha-mes" style={{ background: ev.color }}>
                  {ev.mes}
                </div>
                <div className="calendario-mes-fecha-dia" style={{ color: ev.color }}>
                  {ev.fecha}
                </div>
              </div>
              <div className="calendario-mes-info">
                <div className="calendario-mes-titulo">{ev.titulo}</div>
                <div className="calendario-mes-desc">{ev.descripcion}</div>
                <div className="calendario-mes-lugar" style={{ background: ev.colorLugar }}>
                  <FaMapMarkerAlt style={{ marginRight: 4 }} />
                  {ev.lugar}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default CalendarioEventosMes;