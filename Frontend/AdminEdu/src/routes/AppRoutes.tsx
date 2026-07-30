import { Routes, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";

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

const ALL_INSTITUTIONAL = ["Director", "Secretaria", "Docente", "Estudiante", "Representante", "Administrador"];
const STAFF_COMPARTIDO = ["Director", "Secretaria", "Docente", "Representante"];

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
                    {/* Panel de Administrador — gestión de cuentas es exclusiva del Administrador */}
                    <Route element={<ProtectedRoute roles={["Administrador"]} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                    </Route>

                    {/* Compartido: Director, Secretaria, Docente, Representante */}
                    <Route element={<ProtectedRoute roles={STAFF_COMPARTIDO} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/mi-perfil" element={<MiPerfil />} />
                    </Route>

                    {/* Director — CRUD completo */}
                    <Route element={<ProtectedRoute roles={["Director"]} />}>
                        <Route path="/academias" element={<Academias />} />
                        <Route path="/cursos" element={<Cursos />} />
                        <Route path="/paralelos" element={<Paralelos />} />
                        <Route path="/director/personal" element={<GestionPersonal />} />
                        <Route path="/director/estudiantes" element={<GestionEstudiantes />} />
                    </Route>

                    {/* Secretaria */}
                    <Route element={<ProtectedRoute roles={["Secretaria"]} />}>
                        <Route path="/secretaria/matriculas-pendientes" element={<MatriculasPendientes />} />
                        <Route path="/secretaria/matricula-manual" element={<MatriculaManual />} />
                        <Route path="/secretaria/notificar" element={<EnviarNotificacion />} />
                    </Route>

                    {/* Docente */}
                    <Route element={<ProtectedRoute roles={["Docente"]} />}>
                        <Route path="/docente/mis-paralelos" element={<MisParalelos />} />
                        <Route path="/docente/asistencia" element={<RegistrarAsistencia />} />
                        <Route path="/docente/calificaciones" element={<RegistrarCalificaciones />} />
                    </Route>

                    {/* Estudiante — portal propio */}
                    <Route element={<ProtectedRoute roles={["Estudiante"]} />}>
                        <Route path="/estudiante-dashboard" element={<EstudianteDashboard />} />
                        <Route path="/estudiante-perfil" element={<EstudiantePerfil />} />
                        <Route path="/estudiante-matriculas" element={<EstudianteMatriculas />} />
                        <Route path="/estudiante-historial" element={<EstudianteHistorial />} />
                        <Route path="/estudiante-notificaciones" element={<EstudianteNotificaciones />} />
                        <Route path="/estudiante-cursos" element={<EstudianteCursosDisponibles />} />
                        <Route path="/estudiante-cursos/:id" element={<EstudianteDetalleCurso />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}
