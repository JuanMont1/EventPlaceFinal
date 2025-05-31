import React from 'react';
import '../../styles/pieDePagina.css'; 
import '@fortawesome/fontawesome-free/css/all.css';

const PieDePagina = () => {
  return (
    <footer className="pie">
      <div className="seccion-pie">
        <h3 className="titulo-pie">Enlaces Rápidos</h3>
        <ul className="lista-pie">
          <li className="item-lista-pie"><a href="/" className="enlace-pie">Inicio</a></li>
          <li className="item-lista-pie"><a href="/eventos" className="enlace-pie">Galería de eventos</a></li>
          <li className="item-lista-pie"><a href="/calendario" className="enlace-pie">Calendario</a></li>
          <li className="item-lista-pie"><a href="/proximos-eventos" className="enlace-pie">Próximos eventos</a></li>
        </ul>
      </div>

      <div className="centro-pie">
        <img src="/logo.png" alt="Logo UdeC" className="logo-pie" />
        <h2 className="titulo-pie">Universidad de Cundinamarca</h2>
        <p>Innovación, Excelencia y Compromiso</p>
        <div className="iconos-redes-pie">
          <a href="https://www.facebook.com/ucundinamarcaoficial?locale=es_LA" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="https://www.instagram.com/ucundinamarcaoficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="https://x.com/UCundinamarca" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.youtube.com/@UCundinamrcaTv" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
        </div>
      </div>

      <div className="seccion-pie">
        <h3 className="titulo-pie">Contacto</h3>
        <ul className="lista-pie">
          <li className="item-lista-pie"><i className="fas fa-map-marker-alt"></i>Soacha, Cundinamarca, Colombia</li>
          <li className="item-lista-pie"><i className="fas fa-phone"></i>01 8000 180 414</li>
          <li className="item-lista-pie"><i className="fas fa-envelope"></i>info@ucundinamarca.edu.co</li>
        </ul>
      </div>
    </footer>
  );
};

export default PieDePagina;