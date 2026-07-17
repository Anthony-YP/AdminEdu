import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const cardsPorRol = {
    Director: [
    {
        titulo: "Gestión de Cursos",
        descripcion: "Crear, editar y eliminar cursos y paralelos",
        ruta: "/cursos",
        color: "bg-blue-500"
    }
    ],

    Secretaria: [
        { titulo: "Matrículas", descripcion: "Registrar matrículas de estudiantes", ruta: "#", color: "bg-green-500" },
        { titulo: "Estudiantes", descripcion: "Gestionar datos de estudiantes", ruta: "#", color: "bg-teal-500" },
        { titulo: "Pagos", descripcion: "Registrar comprobantes de pago", ruta: "#", color: "bg-yellow-500" },
        { titulo: "Cursos", descripcion: "Ver cursos disponibles", ruta: "/cursos", color: "bg-blue-500" },
    ],
    Docente: [
        { titulo: "Mis Cursos", descripcion: "Ver cursos y paralelos asignados", ruta: "/cursos", color: "bg-blue-500" },
        { titulo: "Asistencia", descripcion: "Registrar asistencia de estudiantes", ruta: "#", color: "bg-indigo-500" },
        { titulo: "Calificaciones", descripcion: "Ingresar calificaciones", ruta: "#", color: "bg-green-500" },
        { titulo: "Estudiantes", descripcion: "Ver lista de estudiantes", ruta: "#", color: "bg-teal-500" },
    ],
    Estudiante: [
        { titulo: "Mis Cursos", descripcion: "Ver cursos en los que estoy matriculado", ruta: "#", color: "bg-blue-500" },
        { titulo: "Calificaciones", descripcion: "Consultar mis calificaciones", ruta: "#", color: "bg-green-500" },
        { titulo: "Asistencia", descripcion: "Ver mi registro de asistencia", ruta: "#", color: "bg-indigo-500" },
        { titulo: "Pagos", descripcion: "Ver mis comprobantes de pago", ruta: "#", color: "bg-yellow-500" },
    ],
    Representante: [
        { titulo: "Mis Representados", descripcion: "Ver estudiantes a mi cargo", ruta: "#", color: "bg-teal-500" },
        { titulo: "Calificaciones", descripcion: "Consultar calificaciones", ruta: "#", color: "bg-green-500" },
        { titulo: "Pagos", descripcion: "Ver comprobantes de pago", ruta: "#", color: "bg-yellow-500" },
        { titulo: "Notificaciones", descripcion: "Ver notificaciones", ruta: "#", color: "bg-purple-500" },
    ],
};


export default function Dashboard() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const grupoPrincipal = user?.grupos?.[0] || "Sin rol";
    const cards = cardsPorRol[grupoPrincipal] || [];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barra superior */}
            <header className="bg-white shadow border-b">
                 <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Bienvenido, {user?.username}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Panel de {grupoPrincipal}. Gestiona la información académica desde este módulo.
                    </p>
                 </div>
            </header>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Bienvenido, {user?.username}
                    </h2>
                    <p className="text-gray-600">
                        Seleccione una opción para comenzar
                    </p>
                </div>

                {/* Grid de cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(card.ruta)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-6 text-left"
                        >
                            <div className="text-4xl mb-4">
                                📚
                            </div>

                            <h3 className="text-xl font-bold mb-3">
                                {card.titulo}
                            </h3>

                            <p className="text-sm text-blue-100">
                                {card.descripcion}
                            </p>

                            <div className="mt-6 font-semibold">
                                Ir al módulo →
                            </div>
                        </button>
                    ))}
                </div>

                {/* Información del usuario */}
                <div className="mt-10">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">
                        Información de la sesión
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        <div className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-gray-500">Usuario</p>
                            <p className="text-lg font-semibold mt-2">
                                {user?.username}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-gray-500">Rol</p>
                            <p className="text-lg font-semibold mt-2">
                                {grupoPrincipal}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-gray-500">Correo</p>
                            <p className="text-lg font-semibold mt-2 break-all">
                                {user?.email}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow p-5">
                            <p className="text-sm text-gray-500">Permisos</p>
                            <p className="text-lg font-semibold mt-2">
                                {user?.permisos?.length || 0}
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}