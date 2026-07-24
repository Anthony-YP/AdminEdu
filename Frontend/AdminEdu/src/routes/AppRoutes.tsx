import { Routes, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AspiranteLayout from "../components/aspirante/Layout/AspiranteLayout";

// Public
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/Login";
import OAuthCallback from "../pages/auth/OAuthCallback";
import RecuperarContrasena from "../pages/auth/RecuperarContrasena";
import RestablecerContrasena from "../pages/auth/RestablecerContrasena";
import Forbidden from "../pages/Forbidden";

// Institutional — shared dashboard
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import MiPerfil from "../pages/MiPerfil";

// Director
import Academias from "../pages/Academias";
import Cursos from "../pages/Cursos";
import Paralelos from "../pages/Paralelos";
import Usuarios from "../pages/Usuarios";
import Personas from "../pages/Personas";
import GestionPersonal from "../pages/director/GestionPersonal";
import GestionEstudiantes from "../pages/director/GestionEstudiantes";

// Secretaria
import MatriculasPendientes from "../pages/secretaria/MatriculasPendientes";
import MatriculaManual from "../pages/secretaria/MatriculaManual";
import EnviarNotificacion from "../pages/secretaria/EnviarNotificacion";

// Docente
import MisParalelos from "../pages/docente/MisParalelos";
import RegistrarAsistencia from "../pages/docente/RegistrarAsistencia";
import RegistrarCalificaciones from "../pages/docente/RegistrarCalificaciones";

// Estudiante
import EstudianteDashboard from "../pages/EstudianteDashboard";
import EstudiantePerfil from "../pages/EstudiantePerfil";
import EstudianteMatriculas from "../pages/EstudianteMatriculas";
import EstudianteHistorial from "../pages/EstudianteHistorial";
import EstudianteNotificaciones from "../pages/EstudianteNotificaciones";
import EstudianteCursosDisponibles from "../pages/EstudianteCursosDisponibles";
import EstudianteDetalleCurso from "../pages/EstudianteDetalleCurso";

// Aspirante
import DashboardAspirante from "../pages/aspirante/DashboardAspirante";
import CompletarPerfil from "../pages/aspirante/CompletarPerfil";
import CursosDisponibles from "../pages/aspirante/CursosDisponibles";
import DetalleCurso from "../pages/aspirante/DetalleCurso";
import SolicitudesPage from "../pages/aspirante/SolicitudesPage";
import Credenciales from "../pages/aspirante/Credenciales";
import SeguimientoMatricula from "../pages/aspirante/SeguimientoMatricula";
import Documentos from "../pages/aspirante/Documentos";
import Pagos from "../pages/aspirante/Pagos";
import NotificacionesAspirante from "../pages/aspirante/Notificaciones";
import PerfilAspirante from "../pages/aspirante/Perfil";

const ALL_INSTITUTIONAL = ["Director", "Secretaria", "Docente", "Estudiante", "Representante", "Administrador"];

export default function AppRoutes() {
    return (
        <Routes>
            {/* ========================= */}
            {/* PUBLIC ROUTES              */}
            {/* ========================= */}
            <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
                <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
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
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/mi-perfil" element={<MiPerfil />} />

                    {/* Director — CRUD completo */}
                    <Route path="/academias" element={<Academias />} />
                    <Route path="/cursos" element={<Cursos />} />
                    <Route path="/paralelos" element={<Paralelos />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/personas" element={<Personas />} />
                    <Route path="/director/personal" element={<GestionPersonal />} />
                    <Route path="/director/estudiantes" element={<GestionEstudiantes />} />

                    {/* Secretaria */}
                    <Route path="/secretaria/matriculas-pendientes" element={<MatriculasPendientes />} />
                    <Route path="/secretaria/matricula-manual" element={<MatriculaManual />} />
                    <Route path="/secretaria/notificar" element={<EnviarNotificacion />} />

                    {/* Docente */}
                    <Route path="/docente/mis-paralelos" element={<MisParalelos />} />
                    <Route path="/docente/asistencia" element={<RegistrarAsistencia />} />
                    <Route path="/docente/calificaciones" element={<RegistrarCalificaciones />} />

                    {/* Estudiante — portal propio */}
                    <Route path="/estudiante-dashboard" element={<EstudianteDashboard />} />
                    <Route path="/estudiante-perfil" element={<EstudiantePerfil />} />
                    <Route path="/estudiante-matriculas" element={<EstudianteMatriculas />} />
                    <Route path="/estudiante-historial" element={<EstudianteHistorial />} />
                    <Route path="/estudiante-notificaciones" element={<EstudianteNotificaciones />} />
                    <Route path="/estudiante-cursos" element={<EstudianteCursosDisponibles />} />
                    <Route path="/estudiante-cursos/:id" element={<EstudianteDetalleCurso />} />
                </Route>
            </Route>

            {/* ========================= */}
            {/* ASPIRANTE — AspiranteLayout */}
            {/* ========================= */}
            <Route element={<ProtectedRoute roles={["Aspirante"]} />}>
                <Route element={<AspiranteLayout />}>
                    <Route path="/aspirante" element={<DashboardAspirante />} />
                    <Route path="/aspirante/completar-perfil" element={<CompletarPerfil />} />
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
