import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
    Building2,
    BookOpen,
    Users,
    UserCog,
    CalendarDays,
    GraduationCap,
    DollarSign,
    Clock,
    ClipboardCheck,
    Award,
    LayoutDashboard,
    FileText,
    Bell
} from "lucide-react";

// Mapeo de módulos reales que tienen endpoints en el API
const modulosDisponiblesAPI = ["/academias", "/cursos", "/paralelos"];

// Configuración de módulos con iconos de Lucide
const cardsPorRol = {
    Director: [
        { titulo: "Academias", descripcion: "Gestionar academias y sedes", ruta: "/academias", icon: Building2 },
        { titulo: "Cursos", descripcion: "Crear, editar y eliminar cursos", ruta: "/cursos", icon: BookOpen },
        { titulo: "Paralelos", descripcion: "Gestionar paralelos y horarios", ruta: "/paralelos", icon: CalendarDays },
        { titulo: "Usuarios", descripcion: "Visualización de personal", ruta: "/usuarios", icon: Users },
    ],
    Secretaria: [
        { titulo: "Cursos", descripcion: "Ver cursos disponibles", ruta: "/cursos", icon: BookOpen },
        { titulo: "Paralelos", descripcion: "Ver horarios y secciones", ruta: "/paralelos", icon: CalendarDays },
        { titulo: "Matrículas", descripcion: "Registrar matrículas", ruta: "#", icon: ClipboardCheck },
        { titulo: "Estudiantes", descripcion: "Gestionar estudiantes", ruta: "#", icon: GraduationCap },
        { titulo: "Pagos", descripcion: "Comprobantes", ruta: "#", icon: DollarSign },
    ],
    Docente: [
        { titulo: "Cursos Asignados", descripcion: "Ver mis cursos y paralelos", ruta: "/cursos", icon: BookOpen },
        { titulo: "Asistencia", descripcion: "Registrar asistencia", ruta: "#", icon: ClipboardCheck },
        { titulo: "Calificaciones", descripcion: "Ingresar calificaciones", ruta: "#", icon: Award },
    ],
    Estudiante: [
        { titulo: "Inicio", descripcion: "Resumen del estudiante", ruta: "/estudiante-dashboard", icon: LayoutDashboard },
        { titulo: "Mi Perfil", descripcion: "Ver y editar datos personales", ruta: "/estudiante-perfil", icon: UserCog },
        { titulo: "Mis Matrículas", descripcion: "Consultar estado de matrículas", ruta: "/estudiante-matriculas", icon: ClipboardCheck },
        { titulo: "Historial", descripcion: "Ver cursos y notas", ruta: "/estudiante-historial", icon: Award },
        { titulo: "Notificaciones", descripcion: "Leer alertas y mensajes", ruta: "/estudiante-notificaciones", icon: Bell },
    ],
    Representante: [
        { titulo: "Representados", descripcion: "Estudiantes a mi cargo", ruta: "#", icon: Users },
        { titulo: "Notificaciones", descripcion: "Ver notificaciones", ruta: "#", icon: Bell },
    ],
};

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Si el usuario no está cargado, mostramos un skeleton elegante
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 font-medium">Cargando tu panel...</p>
                </div>
            </div>
        );
    }

    const grupoPrincipal = user?.grupos?.[0] || "Sin rol";
    const cards = cardsPorRol[grupoPrincipal] || [];

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
                                {getInitials(user?.username)}
                            </div>
                            <div className="text-white">
                                <p className="font-semibold text-sm">{user?.username}</p>
                                <p className="text-xs text-blue-200">{user?.email}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-3 py-1">
                            {grupoPrincipal}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Resumen rápido - estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{cards.length}</p>
                        <p className="text-sm text-gray-500">Módulos disponibles</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{user?.grupos?.length || 0}</p>
                        <p className="text-sm text-gray-500">Roles asignados</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{user?.permisos?.length || 0}</p>
                        <p className="text-sm text-gray-500">Permisos activos</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">Online</p>
                        <p className="text-sm text-gray-500">Estado de sesión</p>
                    </div>
                </div>
            </div>

            {/* Módulos con diseño mejorado */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-1.5 h-7 rounded-full inline-block"></span>
                        Módulos disponibles
                    </h2>
                    <Badge variant="gray" className="text-sm px-4 py-1.5">
                        {cards.length} módulos
                    </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cards.map((card, index) => {
                        const isAvailable = modulosDisponiblesAPI.includes(card.ruta) || card.ruta === "/usuarios";
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
                                        {!isAvailable && (
                                            <Badge variant="gray" className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1">
                                                Admin
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

            {/* Información de usuario - más detallada y visual */}
            <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md ring-2 ring-white">
                            {getInitials(user?.username)}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-800">Información de sesión</CardTitle>
                            <p className="text-sm text-gray-500">Detalles de tu cuenta y permisos</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Usuario</p>
                            <p className="text-base font-semibold text-gray-900">{user?.username}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Correo electrónico</p>
                            <p className="text-base font-semibold text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Rol principal</p>
                            <Badge variant="blue" className="px-4 py-1.5 text-sm">{grupoPrincipal}</Badge>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Permisos</p>
                            <p className="text-base font-semibold text-gray-900">{user?.permisos?.length || 0} asignados</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}