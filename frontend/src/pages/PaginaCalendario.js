import React from 'react';
import CalendarSection from "../Components/calendario/CalendarSection";
import Slider from "../Components/Slider";
import PieDePagina from '../Components/common/pieDePagina';
import CalendarioEventosMes from "../Components/calendario/CalendarioEventosMes";

const PaginaCalendario = () => {
  return (
    <>
      <div className="main-content">
        <CalendarSection />
        <Slider /> 
        <CalendarioEventosMes />
      </div>
      <PieDePagina/>
    </>
  );
};

export default PaginaCalendario;