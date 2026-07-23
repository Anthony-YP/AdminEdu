import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    academia_nombre?: string;
    precio: number;
    fecha_inicio: string;
    fecha_fin: string;
    imagen?: string | null;
    paralelos?: any[];
}

export default function LandingPage() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loadingCursos, setLoadingCursos] = useState(true);

    useEffect(() => {
        api.get("/cursos/publicos/")
            .then(({ data }) => setCursos(data))
            .catch(() => {})
            .finally(() => setLoadingCursos(false));
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            {/* ─── HEADER ─── */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">AdminEdu</span>
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.98]"
                    >
                        Ingresar al sistema
                    </button>
                </div>
            </header>

            {/* ─── HERO ─── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative">
                    <div className="max-w-3xl">
                        <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                            Plataforma de Gestión Académica
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                            Gestiona tu academia
                            <br />
                            <span className="text-blue-400">de forma inteligente.</span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                            AdminEdu es la plataforma integral para la gestión de academias,
                            cursos y matrículas. Simplifica procesos administrativos y
                            enfócate en lo que importa: la educación.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-7 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 active:scale-[0.98]"
                            >
                                Comenzar ahora
                            </button>
                            <a
                                href="#beneficios"
                                className="px-7 py-3.5 bg-white/10 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-200"
                            >
                                Conocer más
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/10 max-w-xl">
                        <div>
                            <p className="text-3xl font-bold text-white">50+</p>
                            <p className="text-sm text-slate-400 mt-1">Cursos disponibles</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">1000+</p>
                            <p className="text-sm text-slate-400 mt-1">Estudiantes activos</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">98%</p>
                            <p className="text-sm text-slate-400 mt-1">Satisfacción</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── BENEFICIOS ─── */}
            <section id="beneficios" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Beneficios</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                            ¿Por qué elegir AdminEdu?
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            Todo lo que necesitas para gestionar tu academia en una sola plataforma.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Gestión Centralizada", desc: "Administra academias, cursos, paralelos y matrículas desde un solo panel de control intuitivo." },
                            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Procesos Ágiles", desc: "Automatiza la inscripción y seguimiento de matrículas. Reduce tiempos administrativos hasta en un 60%." },
                            { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Reportes en Tiempo Real", desc: "Visualiza estadísticas clave: matrículas, aprobaciones, rendimiento académico y más." },
                        ].map((b, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:border-blue-100 transition-all duration-200 group">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-5 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CÓMO FUNCIONA ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Proceso</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                            ¿Cómo funciona?
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            Tres pasos sencillos para comenzar a usar la plataforma.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
                        {[
                            { step: "1", title: "Crea tu cuenta", desc: "Regístrate con tu correo institucional o solicita acceso al administrador." },
                            { step: "2", title: "Explora cursos", desc: "Navega por la oferta académica disponible y elige el curso que mejor se adapte a ti." },
                            { step: "3", title: "Solicita matrícula", desc: "Envía tu solicitud en línea y recibe notificación cuando sea aprobada." },
                        ].map((s, i) => (
                            <div key={i} className="text-center relative">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 text-white font-bold text-lg relative z-10 shadow-lg shadow-blue-500/20">
                                    {s.step}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CURSOS ─── */}
            <section id="cursos" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Oferta Académica</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                            Cursos Destacados
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            Descubre nuestros cursos diseñados para impulsar tu carrera profesional.
                        </p>
                    </div>

                    {loadingCursos ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                        </div>
                    ) : cursos.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">Próximamente tendremos cursos disponibles.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {cursos.slice(0, 6).map((curso) => (
                                <div
                                    key={curso.id}
                                    className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-blue-100 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{curso.nombre}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                        {curso.descripcion || "Curso de formación profesional"}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600">${curso.precio}</span>
                                        {curso.academia_nombre && (
                                            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                                                {curso.academia_nombre}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\' fill=\'%23fff\' fill-opacity=\'0.15\'/%3E%3C/svg%3E")'}} />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                ¿Listo para transformar tu academia?
                            </h2>
                            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                                Únete a las instituciones que ya confían en AdminEdu para gestionar
                                sus procesos académicos de forma eficiente.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                                >
                                    Empezar gratis
                                </button>
                                <a
                                    href="#beneficios"
                                    className="px-8 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-200"
                                >
                                    Ver beneficios
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto px-6 py-14">
                    <div className="grid md:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">AdminEdu</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-sm">
                                Plataforma integral de gestión académica para instituciones
                                educativas modernas. Simplificamos la administración educativa.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Plataforma</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
                                <li><a href="#cursos" className="hover:text-white transition-colors">Cursos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Quito - Ecuador
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    adminedu@gmail.com
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} AdminEdu. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-slate-600">
                            Academia de Formación Profesional
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
