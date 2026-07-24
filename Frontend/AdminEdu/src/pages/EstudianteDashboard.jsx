import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import {
  BookOpen,
  Bell,
  ClipboardCheck,
  Award,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";

const MODULOS = [
  { titulo: "Cursos Disponibles", descripcion: "Explorar y solicitar nuevas matrículas", ruta: "/estudiante-cursos", icon: BookOpen },
  { titulo: "Mis Matrículas", descripcion: "Consultar y reenviar solicitudes", ruta: "/estudiante-matriculas", icon: ClipboardCheck },
  { titulo: "Historial Académico", descripcion: "Ver cursos, asistencia y notas", ruta: "/estudiante-historial", icon: Award },
  { titulo: "Notificaciones", descripcion: "Leer alertas y mensajes", ruta: "/estudiante-notificaciones", icon: Bell },
  { titulo: "Mi Perfil", descripcion: "Ver y editar datos personales", ruta: "/estudiante-perfil", icon: UserCircle },
];

export default function EstudianteDashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [primerNombre, setPrimerNombre] = useState(null);
  const [matriculas, setMatriculas] = useState([]);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const [personasRes, matriculasRes, notificacionesRes] = await Promise.all([
          api.get("/personas/"),
          api.get("/matriculas/"),
          api.get("/notificaciones/"),
        ]);

        const persona = personasRes.data?.[0];
        if (persona?.nombres) {
          setPrimerNombre(persona.nombres.trim().split(/\s+/)[0]);
        }

        setMatriculas(matriculasRes.data || []);
        setNotificacionesCount(notificacionesRes.data?.length || 0);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el resumen del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const cursosActuales = matriculas.filter((m) => m.estado === "Aprobada");
  const pendientes = matriculas.filter((m) => m.estado === "Pendiente").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative p-8 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-white/80" />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Hola, {primerNombre || usuario?.username || "estudiante"}
            </h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            Tu espacio para revisar tus cursos, tus matrículas y tus notificaciones de forma rápida.
          </p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Cursos actuales */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-1.5 h-7 rounded-full inline-block"></span>
            Cursos actuales
          </h2>
          <Badge variant="gray" className="text-sm px-4 py-1.5">
            {cursosActuales.length} {cursosActuales.length === 1 ? "curso" : "cursos"}
          </Badge>
        </div>

        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : cursosActuales.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-10 text-center text-gray-500">
            Aún no tienes cursos aprobados.
            {pendientes > 0 && ` Tienes ${pendientes} solicitud(es) pendiente(s) de revisión.`}
            <button onClick={() => navigate("/estudiante-cursos")} className="block mx-auto mt-2 text-blue-600 hover:underline text-sm font-medium">
              Explorar cursos disponibles →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursosActuales.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{m.curso_nombre}</h3>
                  <Badge variant="green">Aprobada</Badge>
                </div>
                <p className="text-sm text-gray-500">Paralelo: {m.paralelo_nombre}</p>
                {m.nota_final && (
                  <p className="text-xs text-gray-400 mt-1">Nota final: {m.nota_final}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Módulos disponibles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-1.5 h-7 rounded-full inline-block"></span>
            Módulos disponibles
          </h2>
          {notificacionesCount > 0 && (
            <Badge variant="blue" className="text-sm px-4 py-1.5">
              {notificacionesCount} notificaci{notificacionesCount === 1 ? "ón" : "ones"}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULOS.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.ruta}
                onClick={() => navigate(m.ruta)}
                className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-6"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{m.titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{m.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
