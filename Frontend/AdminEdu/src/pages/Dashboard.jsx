import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import {
    Building2,
    BookOpen,
    Users,
    UserCog,
    CalendarDays,
    GraduationCap,
    ClipboardCheck,
    Award,
    LayoutDashboard,
    Bell
} from "lucide-react";

// Orden de prioridad para deduplicar módulos cuando un usuario tiene varios roles
// (ej. un módulo listado tanto en Director como en Secretaria solo se muestra una vez).
const ORDEN_ROLES = ["Director", "Secretaria", "Docente", "Estudiante", "Representante"];

// Configuración de módulos con iconos de Lucide, por rol
const cardsPorRol = {
    Director: [
        { titulo: "Academia", descripcion: "Editar información de la academia", ruta: "/academias", icon: Building2 },
        { titulo: "Cursos", descripcion: "Crear, editar y cerrar cursos", ruta: "/cursos", icon: BookOpen },
        { titulo: "Paralelos", descripcion: "Crear, editar y deshabilitar paralelos", ruta: "/paralelos", icon: CalendarDays },
        { titulo: "Personal de la academia", descripcion: "Gestionar secretarias y docentes", ruta: "/director/personal", icon: UserCog },
        { titulo: "Estudiantes", descripcion: "Dar de baja estudiantes", ruta: "/director/estudiantes", icon: GraduationCap },
    ],
    Secretaria: [
        { titulo: "Matrículas Pendientes", descripcion: "Aprobar, rechazar o cancelar solicitudes", ruta: "/secretaria/matriculas-pendientes", icon: ClipboardCheck },
        { titulo: "Matrícula Manual", descripcion: "Registrar matrícula en casos excepcionales", ruta: "/secretaria/matricula-manual", icon: GraduationCap },
        { titulo: "Notificar", descripcion: "Enviar notificaciones a los usuarios", ruta: "/secretaria/notificar", icon: Bell },
    ],
    Docente: [
        { titulo: "Mis Paralelos", descripcion: "Ver mis cursos y paralelos asignados", ruta: "/docente/mis-paralelos", icon: BookOpen },
        { titulo: "Asistencia", descripcion: "Registrar asistencia", ruta: "/docente/asistencia", icon: ClipboardCheck },
        { titulo: "Calificaciones", descripcion: "Ingresar calificaciones", ruta: "/docente/calificaciones", icon: Award },
    ],
    Estudiante: [
        { titulo: "Inicio", descripcion: "Resumen del estudiante", ruta: "/estudiante-dashboard", icon: LayoutDashboard },
        { titulo: "Cursos Disponibles", descripcion: "Explorar y solicitar nuevas matrículas", ruta: "/estudiante-cursos", icon: BookOpen },
        { titulo: "Mi Perfil", descripcion: "Ver y editar datos personales", ruta: "/estudiante-perfil", icon: UserCog },
        { titulo: "Mis Matrículas", descripcion: "Consultar estado de matrículas", ruta: "/estudiante-matriculas", icon: ClipboardCheck },
        { titulo: "Historial", descripcion: "Ver cursos, asistencia y notas", ruta: "/estudiante-historial", icon: Award },
        { titulo: "Notificaciones", descripcion: "Leer alertas y mensajes", ruta: "/estudiante-notificaciones", icon: Bell },
    ],
    Representante: [
        { titulo: "Representados", descripcion: "Estudiantes a mi cargo", ruta: "#", icon: Users },
        { titulo: "Notificaciones", descripcion: "Ver notificaciones", ruta: "#", icon: Bell },
    ],
};

export default function Dashboard() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // Roles del usuario que efectivamente tienen módulos definidos. Un
    // Administrador ve la unión de todos los módulos existentes, igual que
    // el resto de las pantallas (bypass ya aplicado en hasRole/hasGroup).
    const rolesConModulos = useMemo(() => {
        if (!usuario) return [];
        if (usuario.groups.includes("Administrador")) return ORDEN_ROLES;
        return ORDEN_ROLES.filter((rol) => usuario.groups.includes(rol));
    }, [usuario]);

    // Módulos combinados de todos los roles del usuario, sin duplicar una
    // misma ruta cuando aparece en más de un rol (ej. "Cursos" en Director y Secretaria).
    const cards = useMemo(() => {
        const vistos = new Set();
        const resultado = [];
        for (const rol of rolesConModulos) {
            for (const modulo of cardsPorRol[rol] || []) {
                const clave = modulo.ruta === "#" ? `${rol}-${modulo.titulo}` : modulo.ruta;
                if (vistos.has(clave)) continue;
                vistos.add(clave);
                resultado.push(modulo);
            }
        }
        return resultado;
    }, [rolesConModulos]);

    // Si el usuario no está cargado, mostramos un skeleton elegante
    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 font-medium">Cargando tu panel...</p>
                </div>
            </div>
        );
    }

    const grupoPrincipal = usuario.groups[0];

    // Extraer iniciales para el avatar
    const getInitials = (username) => {
        if (!username) return "U";
        return username.charAt(0).toUpperCase();
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header mejorado con efecto glass y gradiente */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 shadow-2xl">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutDashboard className="h-8 w-8 text-white/80" />
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Panel de {grupoPrincipal}
                            </h1>
                        </div>
                        <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                            Bienvenido al sistema integrado de gestión académica. Accede a todas las herramientas y módulos según tu rol.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/30">
                                {getInitials(usuario?.username)}
                            </div>
                            <div className="text-white">
                                <p className="font-semibold text-sm">{usuario?.username}</p>
                                <p className="text-xs text-blue-200">{usuario?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-w-[10rem]">
                            {usuario.groups.map((rol) => (
                                <Badge key={rol} variant="outline" className="border-white/30 text-white bg-white/10 px-3 py-1">
                                    {rol}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Módulos disponibles */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-1.5 h-7 rounded-full inline-block"></span>
                            Módulos disponibles
                        </h2>
                        {rolesConModulos.length > 1 && (
                            <p className="text-sm text-gray-500 mt-1 ml-3.5">
                                Según tus roles: {rolesConModulos.join(", ")}
                            </p>
                        )}
                    </div>
                    <Badge variant="gray" className="text-sm px-4 py-1.5">
                        {cards.length} módulos
                    </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cards.map((card, index) => {
                        const isDisabled = card.ruta === "#";
                        const IconComponent = card.icon;

                        return (
                            <div
                                key={index}
                                onClick={() => !isDisabled && navigate(card.ruta)}
                                className={`
                  group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isDisabled
                                        ? 'border-gray-200 opacity-60 cursor-not-allowed'
                                        : 'border-gray-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer'
                                    }
                `}
                            >
                                {/* Fondo decorativo sutil */}
                                {!isDisabled && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}

                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                      ${isDisabled
                                                ? 'bg-gray-100 text-gray-400'
                                                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:shadow-blue-200/50 group-hover:scale-105'
                                            }
                    `}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>
                                        {isDisabled && (
                                            <Badge variant="gray" className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1">
                                                Próximamente
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1.5">{card.titulo}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{card.descripcion}</p>

                                    {/* Indicador de acción */}
                                    {!isDisabled && (
                                        <div className="mt-4 flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>Acceder</span>
                                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
