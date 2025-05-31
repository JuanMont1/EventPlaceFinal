import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BarraNavegacion } from "./Components/common/BarraNavegacion";
import { BarraNavegacion2 } from "./Components/common/BarraNavegacion2";
import { BarraNavegacionAdmin } from "./Components/common/BarraNavegacionAdmin";
import PieDePagina from "./Components/common/pieDePagina";
import UserProfile from "./Components/users/UserProfile";
import Login from "./Components/users/Login";
import Register from "./Components/users/register";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import MisSuscripciones from "./pages/MisSuscripciones";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProximosEventos from "./pages/proximos-eventos";
import GaleriaEventos from "./pages/galeriaDeeventos";
import AdminPage from "./Components/admin/AdminPage";
import PaginaCalendario from "./pages/PaginaCalendario";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import ForoEventos from "./pages/ForoEventos";
import AgregarEvento from "./Components/admin/AgregarEvento";
import GestionEventos from "./Components/admin/GestionEventos";
import TodosLosAnuncios from "./Components/TodosLosAnuncios";
import { EventosProvider } from "./contexts/EventosContext";
import DetalleEvento from "./pages/DetalleEvento";

// rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Rutas donde NO debe aparecer la navbar
  const noNavbarRoutes = [
    "/login",
    "/perfil",
    "/admin/perfil",
    "/proximos-eventos",
    "/eventos",
    "/foro/eventos",
    "/register",
    "/todos-los-anuncios",
     "/todos-los-anuncios",
  ];
  const isNoNavbarRoute =
    noNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/evento/");

  // Rutas donde NO debe aparecer el footer
  const hideFooter = [
    "/login",
    "/register",
    "/perfil",
    "/proximos-eventos",
    "/eventos",
    "/admin/perfil",
    "/foro/eventos",
    "/admin/gestionar-eventos",
    "/evento", 
  "/evento/:id" 
  ];

  return (
    <div className="App">
      {!isNoNavbarRoute &&
        (isAdminRoute ? (
          <BarraNavegacionAdmin />
        ) : user ? (
          <BarraNavegacion2 />
        ) : (
          <BarraNavegacion />
        ))}
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/calendario" element={<PaginaCalendario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/evento/:id" element={<DetalleEvento />} />
        <Route
          path="/MisSuscripciones"
          element={
            <ProtectedRoute>
              <MisSuscripciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/mis-suscripciones" element={<MisSuscripciones />} />
        <Route path="/proximos-eventos" element={<ProximosEventos />} />
        <Route path="/eventos" element={<GaleriaEventos />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agregar-evento"
          element={
            <ProtectedRoute>
              <AgregarEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gestionar-eventos"
          element={
            <ProtectedRoute>
              <GestionEventos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foro/eventos"
          element={
            <ProtectedRoute>
              <ForoEventos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            user && user.isAdmin ? (
              <Navigate to="/admin/gestionar-eventos" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/todos-los-anuncios" element={<TodosLosAnuncios />} />
      </Routes>
      {!hideFooter && !isNoNavbarRoute && <PieDePagina />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventosProvider>
          <AppContent />
        </EventosProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
