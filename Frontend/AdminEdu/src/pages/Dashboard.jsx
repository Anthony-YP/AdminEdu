import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const cardsPorRol = {
    Director: [
        { titulo: "Gestión de Cursos", descripcion: "Crear, editar y eliminar cursos y paralelos", ruta: "/cursos", color: "bg-blue-500" },
        { titulo: "Usuarios", descripcion: "Administrar usuarios del sistema", ruta: "/usuarios", color: "bg-purple-500" },
        { titulo: "Matrículas", descripcion: "Gestionar matrículas de estudiantes", ruta: "#", color: "bg-green-500" },
        { titulo: "Reportes", descripcion: "Ver reportes académicos y financieros", ruta: "#", color: "bg-orange-500" },
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


    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barra superior */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Panel de {grupoPrincipal}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {user?.username} - {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
                    >
                        Cerrar Sesión
                    </button>
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
                            className={`${card.color} text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 p-6 text-left`}
                        >
                            <h3 className="text-lg font-bold mb-2">
                                {card.titulo}
                            </h3>
                            <p className="text-sm opacity-90">
                                {card.descripcion}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Información del usuario */}
                <div className="mt-8 bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Información de la Sesión
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-gray-600">Usuario:</span>
                            <span className="ml-2 text-gray-800">{user?.username}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-600">Email:</span>
                            <span className="ml-2 text-gray-800">{user?.email}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-600">Grupos:</span>
                            <span className="ml-2 text-gray-800">
                                {user?.grupos?.join(", ") || "Ninguno"}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-600">Permisos:</span>
                            <span className="ml-2 text-gray-800">
                                {user?.permisos?.length || 0} permisos asignados
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}