import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
    Users,
    ShieldCheck,
    Building2,
    BookOpen,
    CalendarDays,
    UserCog,
    GraduationCap,
    ClipboardCheck,
    Bell,
} from "lucide-react";

const MODULOS = [
    { titulo: "Usuarios", descripcion: "Gestionar cuentas, roles y accesos", ruta: "/usuarios", icon: Users },
    { titulo: "Academias", descripcion: "Sedes y academias", ruta: "/academias", icon: Building2 },
    { titulo: "Cursos", descripcion: "Oferta académica", ruta: "/cursos", icon: BookOpen },
    { titulo: "Paralelos", descripcion: "Secciones, horarios y cupos", ruta: "/paralelos", icon: CalendarDays },
    { titulo: "Personal", descripcion: "Directores, secretarias y docentes", ruta: "/director/personal", icon: UserCog },
    { titulo: "Estudiantes", descripcion: "Gestión y bajas de estudiantes", ruta: "/director/estudiantes", icon: GraduationCap },
    { titulo: "Matrículas Pendientes", descripcion: "Aprobar, rechazar o cancelar", ruta: "/secretaria/matriculas-pendientes", icon: ClipboardCheck },
    { titulo: "Notificar", descripcion: "Enviar notificaciones", ruta: "/secretaria/notificar", icon: Bell },
];

export default function AdminDashboard() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl">
                <div className="relative p-8 md:p-10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Administrador</h1>
                        <p className="text-slate-300 mt-1">
                            Bienvenido, {usuario?.username}. Tienes acceso completo a todos los módulos del sistema.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-slate-700 to-slate-900 w-1.5 h-7 rounded-full inline-block"></span>
                    Módulos del sistema
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MODULOS.map((m) => {
                        const Icon = m.icon;
                        return (
                            <div
                                key={m.ruta}
                                onClick={() => navigate(m.ruta)}
                                className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-6"
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg mb-5 group-hover:scale-105 transition-transform">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{m.titulo}</h3>
                                <p className="text-sm text-gray-500">{m.descripcion}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
