import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db, ADMIN_EMAILS } from "../../config/firebase";
import udecLogo from "../../archivos/img/logoyu.png";
import "../../styles/Login.css";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Form, Button } from "react-bootstrap";

const CARRERAS = [
  "Ingeniería en desarrollo de software",
  "Ingeniería Industrial",
  "Deportes",
  "Otra",
];
const Login = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showCarreraModal, setShowCarreraModal] = useState(false);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [userTemp, setUserTemp] = useState(null);

  const handleRegisterClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate("/register"), 500);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      let userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp(),
      };

      // Verifica si el email del usuario está en la lista de administradores
      if (ADMIN_EMAILS.includes(result.user.email)) {
        userData.role = "admin";
      } else {
        userData.role = "user";
      }

      // Si el usuario NO existe o NO tiene carrera, pedirla
      if (!userSnap.exists() || !userSnap.data().carrera) {
        setUserTemp({
          userRef,
          userData,
          isNew: !userSnap.exists(),
          role: userData.role,
        });
        setShowCarreraModal(true);
        setIsLoading(false);
        return;
      }

      await setDoc(userRef, userData, { merge: true });
      // Redirigir basado en el rol del usuario
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/MisSuscripciones");
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/MisSuscripciones");
        }
      } else {
        navigate("/MisSuscripciones");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardarCarrera = async () => {
  if (!carreraSeleccionada || !userTemp) return;
  const { userRef, userData, isNew, role } = userTemp;
  const dataToSave = {
    ...userData,
    carrera: carreraSeleccionada,
  };
  if (isNew) {
    dataToSave.createdAt = serverTimestamp();
  }
  await setDoc(userRef, dataToSave, { merge: true });
  setShowCarreraModal(false);
  setCarreraSeleccionada("");
  setUserTemp(null);
  if (role === 'admin') {
    navigate('/admin');
  } else {
    navigate('/MisSuscripciones');
  }
};

  return (
    <div className={`login-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="login-box">
        <img src={udecLogo} alt="Logo UdeC" className="login-logo" />
        <h1 className="login-title"> ¡Los eventos te esperan! </h1>
        <p className="login-subtitle">
          Bienvenido al sistema de eventos de la Universidad de Cundinamarca
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Correo institucional</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ucundinamarca.edu.co"
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />

          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="forgot-password">
          ¿Olvidaste tu contraseña? <button>Recupérala aquí</button>
        </p>

        <div className="divider">_________________ o ________________</div>

        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            "Cargando..."
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="google-icon"
              />
              Iniciar sesión con Google
            </>
          )}
        </button>

        <p className="register">
          ¿No tienes cuenta?{" "}
          <button onClick={handleRegisterClick} style={{ cursor: "pointer" }}>
            Regístrate
          </button>
        </p>
      </div>

      <Modal show={showCarreraModal} onHide={() => {}} backdrop="static" centered>
        <Modal.Header>
          <Modal.Title>Selecciona tu carrera</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Carrera</Form.Label>
              <Form.Select
                value={carreraSeleccionada}
                onChange={e => setCarreraSeleccionada(e.target.value)}
              >
                <option value="">Selecciona una carrera</option>
                {CARRERAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!carreraSeleccionada}
            onClick={handleGuardarCarrera}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
