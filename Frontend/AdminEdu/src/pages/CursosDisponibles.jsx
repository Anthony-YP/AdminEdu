import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    GraduationCap,
    ChevronRight,
    Calendar,
    DollarSign,
    School,
    ArrowLeft,
    Star
} from "lucide-react";

export default function CursosDisponibles() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [academia, setAcademia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("http://127.0.0.1:8000/api/home/").then((r) => r.json()),
            fetch("http://127.0.0.1:8000/api/cursos-disponibles/").then((r) => r.json()),
        ])
            .then(([homeData, cursosData]) => {
                const academias = homeData.academias || [];
                setAcademia(academias.length > 0 ? academias[0] : null);
                setCursos(cursosData.cursos || []);
            })
            .catch((err) => console.error("Error al cargar datos:", err))
            .finally(() => setLoading(false));
    }, []);

    const getEstadoCurso = (fechaInicio, fechaFin) => {
        const hoy = new Date();
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (hoy < inicio) return { label: "Próximo", color: "bg-yellow-100 text-yellow-800" };
        if (hoy > fin) return { label: "Finalizado", color: "bg-gray-100 text-gray-600" };
        return { label: "Activo", color: "bg-green-100 text-green-800" };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* ─── NAVBAR ─── */}
            <nav className="relative z-10 border-b border-white/20 bg-white/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-gray-900">
                                    Admin<span className="text-blue-600">Edu</span>
                                </span>
                                <p className="text-xs text-gray-500 -mt-1">Cursos Disponibles</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-5 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4 border border-white/10">
                        <BookOpen className="w-4 h-4" />
                        {cursos.length} {cursos.length === 1 ? "curso disponible" : "cursos disponibles"}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                        {academia ? `Cursos de ${academia.nombre}` : "Nuestros Cursos"}
                    </h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        Explora nuestra oferta académica y encuentra el curso perfecto para ti.
                    </p>
                </div>
            </section>

            {/* ─── LISTA DE CURSOS ─── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                ) : cursos.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay cursos disponibles</h2>
                        <p className="text-gray-500">Actualmente no hay cursos registrados en el sistema.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cursos.map((curso) => {
                            const estado = getEstadoCurso(curso.fecha_inicio, curso.fecha_fin);
                            return (
                                <div
                                    key={curso.id}
                                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Barra de color superior */}
                                    <div className={`h-2 ${
                                        estado.label === "Activo" ? "bg-green-500" :
                                        estado.label === "Próximo" ? "bg-yellow-500" : "bg-gray-400"
                                    }`}></div>

                                    <div className="p-6">
                                        {/* Academia y estado */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <School className="w-4 h-4" />
                                                <span>{academia?.nombre || "Academia"}</span>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estado.color}`}>
                                                {estado.label}
                                            </span>
                                        </div>

                                        {/* Nombre del curso */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {curso.nombre}
                                        </h3>

                                        {/* Detalles */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Fecha de inicio</p>
                                                    <p className="font-medium">{new Date(curso.fecha_inicio).toLocaleDateString("es-EC", { year: "numeric", month: "long", day: "numeric" })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Fecha de fin</p>
                                                    <p className="font-medium">{new Date(curso.fecha_fin).toLocaleDateString("es-EC", { year: "numeric", month: "long", day: "numeric" })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Precio</p>
                                                    <p className="font-bold text-lg text-purple-700">${parseFloat(curso.precio).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botón */}
                                        <button
                                            onClick={() => navigate("/login")}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg group/btn"
                                        >
                                            <GraduationCap className="w-4 h-4" />
                                            <span>Inscribirme</span>
                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ─── CTA ─── */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        ¿Ya tienes una cuenta?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Inicia sesión para gestionar tus cursos y matrículas.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-lg"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-gray-900 border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-400 font-semibold">AdminEdu</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} AdminEdu. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}