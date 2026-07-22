import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    GraduationCap,
    MapPin,
    Phone,
    ChevronRight,
    School,
    Users,
    CalendarCheck,
    Star
} from "lucide-react";

export default function Home() {
    const navigate = useNavigate();
    const [academias, setAcademias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/home/")
            .then((res) => res.json())
            .then((data) => {
                setAcademias(data.academias || []);
            })
            .catch((err) => console.error("Error al cargar home:", err))
            .finally(() => setLoading(false));
    }, []);

    const academia = academias.length > 0 ? academias[0] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* ─── NAVBAR ─── */}
            <nav className="relative z-10 border-b border-white/20 bg-white/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                Admin<span className="text-blue-600">Edu</span>
                            </span>
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

            {/* ─── HERO SECTION ─── */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900 opacity-95"></div>
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 border border-white/10">
                                <Star className="w-4 h-4 text-yellow-400" />
                                Excelencia Académica
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                                {academia ? academia.nombre : "Bienvenido a AdminEdu"}
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-xl">
                                Sistema integral de gestión académica. Administra cursos, paralelos,
                                matrículas y más, todo en un solo lugar.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => navigate("/cursos-disponibles")}
                                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200 text-lg"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Ver Cursos Disponibles
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-lg"
                                >
                                    Acceder al Sistema
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center">
                            <div className="relative">
                                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 animate-pulse absolute -top-10 -left-10 blur-3xl"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                                    <GraduationCap className="w-40 h-40 text-white/80 mx-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── INFORMACIÓN DE LA ACADEMIA ─── */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : academia ? (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Nuestra Academia
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Conoce más sobre nuestra institución y todo lo que tenemos para ofrecerte.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-5">
                                <School className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{academia.nombre}</h3>
                            <p className="text-gray-500">Academia líder en educación con los más altos estándares de calidad.</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-5">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ubicación</h3>
                            <p className="text-gray-500">
                                {academia.direccion?.calle_principal || "Dirección no disponible"}
                                {academia.direccion?.ciudad ? `, ${academia.direccion.ciudad}` : ""}
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-5">
                                <Phone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Contacto</h3>
                            <p className="text-gray-500">{academia.telefono || "Teléfono no disponible"}</p>
                        </div>
                    </div>

                    {/* ─── ESTADÍSTICAS ─── */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">{academias.length}</div>
                                <p className="text-blue-200 text-sm font-medium">Sedes</p>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">
                                    <BookOpen className="w-8 h-8 mx-auto text-blue-200" />
                                </div>
                                <p className="text-blue-200 text-sm font-medium">Cursos</p>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">
                                    <Users className="w-8 h-8 mx-auto text-blue-200" />
                                </div>
                                <p className="text-blue-200 text-sm font-medium">Estudiantes</p>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">
                                    <CalendarCheck className="w-8 h-8 mx-auto text-blue-200" />
                                </div>
                                <p className="text-blue-200 text-sm font-medium">Años de experiencia</p>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                        <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido a AdminEdu</h2>
                        <p className="text-gray-500 mb-6">
                            Sistema integral de gestión académica. No hay academias registradas aún.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Acceder al Sistema
                        </button>
                    </div>
                </section>
            )}

            {/* ─── CURSOS CTA ─── */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Listo para empezar tu aprendizaje?
                    </h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Explora nuestra oferta académica y encuentra el curso perfecto para ti.
                    </p>
                    <button
                        onClick={() => navigate("/cursos-disponibles")}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-xl hover:shadow-blue-500/25 text-lg"
                    >
                        <BookOpen className="w-5 h-5" />
                        Ver Cursos Disponibles
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