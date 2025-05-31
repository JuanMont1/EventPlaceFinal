import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEventos } from "../../contexts/EventosContext";
import {
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../config/firebase";
import "../../styles/UserProfile.css";
import {
  FaCalendarAlt,
  FaCode,
  FaUsers,
  FaTicketAlt,
  FaGraduationCap,
  FaBuilding,
  FaClock,
  FaArrowLeft,
  FaSignOutAlt,
  FaEnvelope,
  FaCalendarCheck,
  FaHistory,
  FaTrophy,
  FaChartBar,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { logros as todosLosLogros } from "../../Components/users/logros";

const TarjetaEvento = React.memo(({ evento, manejarDesuscripcion }) => {
  const navigate = useNavigate();
  const [eventoActualizado, setEventoActualizado] = useState(evento);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "eventos", evento.id), (doc) => {
      if (doc.exists()) {
        setEventoActualizado({ ...doc.data(), id: doc.id });
      }
    });
    return () => unsubscribe();
  }, [evento.id]);

  return (
    <div className="tarjeta-evento">
      <div
        className="evento-imagen"
        style={{ backgroundImage: `url(${eventoActualizado.imagen})` }}
      ></div>
      <div className="evento-contenido">
        <h3>{eventoActualizado.nombre}</h3>
        <p>
          <FaCalendarAlt /> {eventoActualizado.fecha}
        </p>
        <p>
          <FaCode /> {eventoActualizado.categoria}
        </p>
        <p>
          <FaUsers />{" "}
          <strong>
            {Object.keys(eventoActualizado.suscripciones || {}).length}
          </strong>{" "}
          suscripciones
        </p>
        <p>
          <FaTicketAlt /> <strong>{eventoActualizado.cuposDisponibles}</strong>{" "}
          cupos disponibles
        </p>
        <p>
          <FaGraduationCap /> {eventoActualizado.facultad}
        </p>
        <p className="evento-descripcion">{eventoActualizado.descripcion}</p>
        <div className="evento-acciones">
          {manejarDesuscripcion && (
            <button
              onClick={() => manejarDesuscripcion(eventoActualizado.id)}
              className="btn-desuscribir"
            >
              Cancelar Suscripción
            </button>
          )}
          <button
            onClick={() => navigate(`/foro/${eventoActualizado.id}`)}
            className="btn-foro"
          >
            Ir al Foro
          </button>
        </div>
      </div>
    </div>
  );
});

const ProfileHeader = ({ handleLogout }) => {
  const navigate = useNavigate();
  return (
    <header className="profile-header">
      <button onClick={() => navigate(-1)} className="back-link">
        <FaArrowLeft /> Volver
      </button>
      <h1>Perfil de Usuario</h1>
      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt /> Cerrar Sesión
      </button>
    </header>
  );
};

const UserInfo = ({
  userData,
  editMode,
  newName,
  setNewName,
  handleEditProfile,
  handleSaveProfile,
  intereses,
  toggleInteres,
}) => (
  <section className="user-info">
    <div className="user-avatar">
      <img
        src={
          userData.photoURL
            ? userData.photoURL
            : "https://randomuser.me/api/portraits/lego/1.jpg"
        }
        alt="Foto de perfil"
        className="profile-image"
      />
    </div>
    <div className="user-details">
      {editMode ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="edit-name-input"
        />
      ) : (
        <h2>{userData.name}</h2>
      )}
      <p className="user-role">
        <FaGraduationCap />{" "}
        {userData.role === "admin" ? "Administrador" : "Estudiante"}
      </p>
      <p className="user-email">
        <FaEnvelope /> {userData.email}
      </p>
      <p className="user-career">
        <FaGraduationCap /> {userData.carrera || "Carrera no especificada"}
      </p>{" "}
      {/* Cambia aquí */}
      {editMode ? (
        <button onClick={handleSaveProfile} className="save-btn">
          Guardar Cambios
        </button>
      ) : (
        <button onClick={handleEditProfile} className="edit-btn">
          Editar Perfil
        </button>
      )}
    </div>
    <div className="user-interests">
      <h3>Intereses</h3>
      <div className="interest-tags">
        {["Académico", "Cultural", "Deportivo", "Tecnologico", "Artistico"].map(
          (interes) => (
            <button
              key={interes}
              className={`interest-tag ${
                intereses.includes(interes) ? "active" : ""
              }`}
              onClick={() => toggleInteres(interes)}
            >
              {interes}
            </button>
          )
        )}
      </div>
    </div>
  </section>
);

const UserStats = ({ suscripciones }) => (
  <section className="user-stats">
    <div className="stat-item">
      <FaCalendarCheck />
      <span>{suscripciones.length}</span>
      <p>Eventos Suscritos</p>
    </div>
    <div className="stat-item">
      <FaClock />
      <span>
        {suscripciones.filter((e) => new Date(e.fecha) > new Date()).length}
      </span>
      <p>Eventos Próximos</p>
    </div>
    <div className="stat-item">
      <FaHistory />
      <span>
        {suscripciones.filter((e) => new Date(e.fecha) <= new Date()).length}
      </span>
      <p>Eventos Pasados</p>
    </div>
  </section>
);

const Logros = ({ logrosUsuario }) => (
  <section className="user-achievements">
    <h2>
      <FaTrophy /> Logros
    </h2>
    <div className="achievements-grid">
      {todosLosLogros.map((logro) => (
        <div
          key={logro.id}
          className={`achievement-item ${
            logrosUsuario.includes(logro.id) ? "obtenido" : "bloqueado"
          }`}
        >
          <span className="logro-icono">{logro.icono}</span>
          <p className="logro-nombre">{logro.nombre}</p>
          <p className="logro-descripcion">{logro.descripcion}</p>
        </div>
      ))}
    </div>
  </section>
);

const EventosRecomendados = ({ eventos }) => (
  <section className="eventos-recomendados">
    <h2>Eventos Recomendados</h2>
    <div className="eventos-grid">
      {eventos.map((evento) => (
        <TarjetaEvento key={evento.id} evento={evento} />
      ))}
    </div>
  </section>
);

const EstadisticasParticipacion = ({ data }) => (
  <section className="estadisticas-participacion">
    <h2>
      <FaChartBar /> Estadísticas de Participación
    </h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </section>
);

const EventosSuscritos = ({
  suscripciones,
  manejarDesuscripcion,
  eventosDisponibles,
}) => (
  <section className="eventos-suscritos">
    <h2>Eventos Suscritos</h2>
    <div className="eventos-grid">
      {suscripciones.length > 0 ? (
        suscripciones.map((evento) => {
          const eventoCompleto =
            eventosDisponibles.find((e) => e.id === evento.id) || evento;
          return (
            <TarjetaEvento
              key={evento.id}
              evento={eventoCompleto}
              manejarDesuscripcion={manejarDesuscripcion}
            />
          );
        })
      ) : (
        <p className="no-eventos">No estás suscrito a ningún evento.</p>
      )}
    </div>
  </section>
);

const UserProfile = () => {
  const { user } = useAuth();
  const { suscripciones, eventosDisponibles, toggleSuscripcion } = useEventos();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [intereses, setIntereses] = useState([]);
  const [logros, setLogros] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setIntereses(docSnap.data().intereses || []);
          setLogros(docSnap.data().logros || []);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigate]);

  const handleEditProfile = useCallback(() => {
    setEditMode(true);
    setNewName(user?.displayName || "");
  }, [user]);

  const handleSaveProfile = useCallback(async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [user, newName]);

  const manejarDesuscripcion = useCallback(
    async (eventoId) => {
      const evento = eventosDisponibles.find((e) => e.id === eventoId);
      if (evento) {
        await toggleSuscripcion(evento);
      }
    },
    [eventosDisponibles, toggleSuscripcion]
  );

  const toggleInteres = useCallback(
    async (interes) => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      try {
        if (intereses.includes(interes)) {
          await updateDoc(userRef, { intereses: arrayRemove(interes) });
        } else {
          await updateDoc(userRef, { intereses: arrayUnion(interes) });
        }
      } catch (error) {
        console.error("Error al actualizar intereses:", error);
      }
    },
    [user, intereses]
  );

  const eventosRecomendados = useMemo(() => {
    return eventosDisponibles
      .filter(
        (evento) =>
          intereses.includes(evento.categoria) &&
          !suscripciones.some((s) => s.id === evento.id)
      )
      .slice(0, 3);
  }, [eventosDisponibles, intereses, suscripciones]);

  const estadisticasParticipacion = useMemo(() => {
    const categorias = {};
    suscripciones.forEach((evento) => {
      categorias[evento.categoria] = (categorias[evento.categoria] || 0) + 1;
    });
    return Object.entries(categorias).map(([name, value]) => ({ name, value }));
  }, [suscripciones]);

  const sortedSuscripciones = useMemo(
    () =>
      [...suscripciones].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
    [suscripciones]
  );

  if (!userData)
    return (
      <div className="no-user">No se encontró información del usuario</div>
    );

  return (
    <div className="user-profile">
      <ProfileHeader handleLogout={handleLogout} />
      <main className="profile-content">
        <UserInfo
          userData={userData}
          editMode={editMode}
          newName={newName}
          setNewName={setNewName}
          handleEditProfile={handleEditProfile}
          handleSaveProfile={handleSaveProfile}
          intereses={intereses}
          toggleInteres={toggleInteres}
        />
        <UserStats suscripciones={suscripciones} />
        <EventosSuscritos
          suscripciones={sortedSuscripciones}
          manejarDesuscripcion={manejarDesuscripcion}
          eventosDisponibles={eventosDisponibles}
        />
        <Logros logrosUsuario={logros} />
        <EventosRecomendados eventos={eventosRecomendados} />
        <EstadisticasParticipacion data={estadisticasParticipacion} />
      </main>
    </div>
  );
};

export default UserProfile;
