import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AuthService from "../../services/AuthService";

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

interface Direccion {
    ciudad: string;
    calle_principal: string;
    calle_secundaria: string;
    numero_casa: string;
    referencia: string;
}

interface Academia {
    id: number;
    nombre: string;
    telefono: string;
    direccion: Direccion;
}

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

export default function LandingPage() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loadingCursos, setLoadingCursos] = useState(true);
    const [academia, setAcademia] = useState<Academia | null>(null);
    const [directorNombre, setDirectorNombre] = useState<string | null>(null);

    useEffect(() => {
        api.get("/cursos/publicos/")
            .then(({ data }) => setCursos(data))
            .catch(() => {})
            .finally(() => setLoadingCursos(false));

        api.get("/institucion/")
            .then(({ data }) => {
                setAcademia(data.academia);
                setDirectorNombre(data.director_nombre);
            })
            .catch(() => {});
    }, []);

    const nombreAcademia = academia?.nombre || "nuestra institución";

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            {/* ─── HEADER ─── */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight truncate">{nombreAcademia}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={() => navigate("/login")}
                            className="hidden sm:inline text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Acceso institucional
                        </button>
                        <button
                            onClick={() => AuthService.loginGoogle()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98]"
                        >
                            <GoogleIcon />
                            <span className="hidden sm:inline">Continuar con Google</span>
                            <span className="sm:hidden">Google</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ─── HERO ─── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative">
                    <div className="max-w-3xl">
                        <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                            Institución Educativa
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                            {nombreAcademia}
                            <br />
                            <span className="text-blue-400"></span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                            En {nombreAcademia} ofrecemos cursos técnicos con
                            docentes especializados y un proceso de matrícula 100% en línea.
                            Explora nuestra oferta académica y solicita tu matricula hoy mismo.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => AuthService.loginGoogle()}
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98]"
                            >
                                <GoogleIcon />
                                Continuar con Google
                            </button>
                            <a
                                href="#cursos"
                                className="px-7 py-3.5 bg-white/10 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-200"
                            >
                                Ver cursos disponibles
                            </a>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            Si eres Director, Secretaría, Docente <button onClick={() => navigate("/login")} className="text-blue-300 hover:text-blue-200 underline underline-offset-2">Ingresa aquí</button>.
                        </p>
                    </div>

                    {/* Datos de la institución */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/10 max-w-2xl">
                        <div>
                            <p className="text-sm text-slate-400">Dirección a cargo de</p>
                            <p className="text-lg font-bold text-white mt-1">{directorNombre || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Ubicación</p>
                            <p className="text-lg font-bold text-white mt-1">{academia?.direccion?.ciudad || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Contacto</p>
                            <p className="text-lg font-bold text-white mt-1">{academia?.telefono || "—"}</p>
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
                            ¿Por qué elegir nuestros cursos?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", title: "Formación Práctica", desc: "Cursos técnicos diseñados junto a docentes especializados en cada área." },
                            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Matrícula Ágil", desc: "Solicita tu matricula en línea con tu cuenta de Google y recibe respuesta rápida de Secretaría." },
                            { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Seguimiento en Línea", desc: "Consulta el estado de tu matrícula, tu asistencia y tus calificaciones desde tu cuenta." },
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
                            ¿Cómo me matriculo?
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            Tres pasos sencillos para convertirte en estudiante.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />
                        {[
                            { step: "1", title: "Ingresa con Google", desc: "Continúa con tu cuenta de Google para registrarte como aspirante, sin formularios largos." },
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
                            Cursos Disponibles
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            Cursos actualmente habilitados para matrícula en {nombreAcademia}.
                        </p>
                    </div>

                    {loadingCursos ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                        </div>
                    ) : cursos.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">Por el momento no hay cursos habilitados. Vuelve pronto.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {cursos.slice(0, 6).map((curso) => (
                                <div
                                    key={curso.id}
                                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-200 group"
                                >
                                    {curso.imagen ? (
                                        <div className="h-36 w-full overflow-hidden bg-slate-100">
                                            <img src={curso.imagen} alt={curso.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    ) : (
                                        <div className="h-36 w-full bg-blue-50 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{curso.nombre}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                                            {curso.descripcion || "Curso de formación profesional"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-blue-600">${curso.precio}</span>
                                            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                                                Habilitado
                                            </span>
                                        </div>
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
                                ¿Listo para empezar?
                            </h2>
                            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                                Continúa con tu cuenta de Google para explorar la oferta académica de{" "}
                                {nombreAcademia} y solicitar tu matrícula.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button
                                    onClick={() => AuthService.loginGoogle()}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                                >
                                    <GoogleIcon />
                                    Continuar con Google
                                </button>
                                <a
                                    href="#cursos"
                                    className="px-8 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-200"
                                >
                                    Ver cursos
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
                                <span className="text-lg font-bold text-white">{nombreAcademia}</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-sm">
                                Cursos técnicos, con procesos de 
                                matrícula y seguimiento académico 
                                100% en línea.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Plataforma</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li><a href="#beneficios" className="hover:text-white transition-colors">Beneficios</a></li>
                                <li><a href="#cursos" className="hover:text-white transition-colors">Cursos</a></li>
                                <li><button onClick={() => navigate("/login")} className="hover:text-white transition-colors">Acceso institucional</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h4>
                            <ul className="space-y-2.5 text-sm">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {academia?.direccion?.ciudad || "—"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {academia?.telefono || "—"}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} {nombreAcademia}. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-slate-600">
                            Sistema de gestión académica AdminEdu
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
