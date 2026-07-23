import { Routes, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AspiranteLayout from "../components/aspirante/Layout/AspiranteLayout";

// Public
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/Login";
import OAuthCallback from "../pages/auth/OAuthCallback";
import Forbidden from "../pages/Forbidden";

// Institutional — shared dashboard
import Dashboard from "../pages/Dashboard";

// Director
import Academias from "../pages/Academias";
import Cursos from "../pages/Cursos";
import Paralelos from "../pages/Paralelos";
import Usuarios from "../pages/Usuarios";
import Personas from "../pages/Personas";

// Estudiante
import EstudianteDashboard from "../pages/EstudianteDashboard";
import EstudiantePerfil from "../pages/EstudiantePerfil";
import EstudianteMatriculas from "../pages/EstudianteMatriculas";
import EstudianteHistorial from "../pages/EstudianteHistorial";
import EstudianteNotificaciones from "../pages/EstudianteNotificaciones";

// Aspirante
import DashboardAspirante from "../pages/aspirante/DashboardAspirante";
import CursosDisponibles from "../pages/aspirante/CursosDisponibles";
import DetalleCurso from "../pages/aspirante/DetalleCurso";
import SolicitudesPage from "../pages/aspirante/SolicitudesPage";
import Credenciales from "../pages/aspirante/Credenciales";
import SeguimientoMatricula from "../pages/aspirante/SeguimientoMatricula";
import Documentos from "../pages/aspirante/Documentos";
import Pagos from "../pages/aspirante/Pagos";
import NotificacionesAspirante from "../pages/aspirante/Notificaciones";
import PerfilAspirante from "../pages/aspirante/Perfil";

const ALL_INSTITUTIONAL = ["Director", "Secretaria", "Docente", "Estudiante", "Representante"];

export default function AppRoutes() {
    return (
        <Routes>
            {/* ========================= */}
            {/* PUBLIC ROUTES              */}
            {/* ========================= */}
            <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
            </Route>

            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/403" element={<Forbidden />} />

            {/* ========================= */}
            {/* INSTITUTIONAL — MainLayout */}
            {/* All roles share this layout with sidebar navigation */}
            {/* ========================= */}
            <Route element={<ProtectedRoute roles={ALL_INSTITUTIONAL} />}>
                <Route element={<MainLayout />}>
                    {/* Shared dashboard for Director, Secretaria, Docente, Representante */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Director — CRUD completo */}
                    <Route path="/academias" element={<Academias />} />
                    <Route path="/cursos" element={<Cursos />} />
                    <Route path="/paralelos" element={<Paralelos />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/personas" element={<Personas />} />

                    {/* Estudiante — portal propio */}
                    <Route path="/estudiante-dashboard" element={<EstudianteDashboard />} />
                    <Route path="/estudiante-perfil" element={<EstudiantePerfil />} />
                    <Route path="/estudiante-matriculas" element={<EstudianteMatriculas />} />
                    <Route path="/estudiante-historial" element={<EstudianteHistorial />} />
                    <Route path="/estudiante-notificaciones" element={<EstudianteNotificaciones />} />
                </Route>
            </Route>

            {/* ========================= */}
            {/* ASPIRANTE — AspiranteLayout */}
            {/* ========================= */}
            <Route element={<ProtectedRoute roles={["Aspirante"]} />}>
                <Route element={<AspiranteLayout />}>
                    <Route path="/aspirante" element={<DashboardAspirante />} />
                    <Route path="/aspirante/cursos" element={<CursosDisponibles />} />
                    <Route path="/aspirante/cursos/:id" element={<DetalleCurso />} />
                    <Route path="/aspirante/solicitudes" element={<SolicitudesPage />} />
                    <Route path="/aspirante/segumiento" element={<SeguimientoMatricula />} />
                    <Route path="/aspirante/documentos" element={<Documentos />} />
                    <Route path="/aspirante/pagos" element={<Pagos />} />
                    <Route path="/aspirante/notificaciones" element={<NotificacionesAspirante />} />
                    <Route path="/aspirante/credenciales" element={<Credenciales />} />
                    <Route path="/aspirante/perfil" element={<PerfilAspirante />} />
                </Route>
            </Route>
        </Routes>
    );
}
