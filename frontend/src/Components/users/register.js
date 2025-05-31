import React, { useState } from 'react';
import '../../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import udecLogo from '../../archivos/img/logoyu.png';

const Registro = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario de registro enviado");
  };

  const handleGoogleRegister = () => {
    console.log("Registrar con Google");
  };

  const handleRegisterClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate('/login'), 500);
  };

  return (
    <div className={`login-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-box">
        <img src={udecLogo} alt="Logo UdeC" className="login-logo" />
        <h1 className="login-title"> ¡Únete a los eventos! </h1>
        <p className="login-subtitle">
          Crea tu cuenta para acceder al sistema de eventos de la Universidad de Cundinamarca
        </p>

        <form className="login-form" onSubmit={handleRegisterSubmit}>
          <label>Nombre Completo</label>
          <input type="text" placeholder="Tu nombre completo" required />

          <label>Correo institucional</label>
          <input type="email" placeholder="usuario@ucundinamarca.edu.co" required />

          <label>Contraseña</label>
          <input type="password" placeholder="********" required />

          <label>Confirma tu contraseña</label>
          <input type="password" placeholder="********" required />

          <button type="submit" className="login-btn">Registrarse</button>
        </form>

        <div className="divider">_________________ o ________________</div>

        <button onClick={handleGoogleRegister} className="google-btn">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Registrarse con Google
        </button>

        <p className="register">
          ¿Ya tienes una cuenta? 
          <a href="/login" onClick={handleRegisterClick}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Registro;
