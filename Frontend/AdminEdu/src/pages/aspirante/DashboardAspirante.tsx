import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AspiranteService, { SolicitudMatricula, Curso } from "../../services/AspiranteService";

export default function DashboardAspirante() {
    const { usuario } = useAuth();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [solicitudes, setSolicitudes] = useState<SolicitudMatricula[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [c, s] = await Promise.all([
                    AspiranteService.getCursos(),
                    AspiranteService.getSolicitudes(),
                ]);
                setCursos(c);
                setSolicitudes(s);
            } catch {
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
    const aprobadas = solicitudes.filter((s) => s.estado === "Aprobada").length;
    const rechazadas = solicitudes.filter((s) => s.estado === "Rechazada").length;

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Bienvenido, {usuario?.first_name || usuario?.username}
                </h1>
                <p className="text-slate-500 mt-1">
                    Aquí puedes explorar cursos disponibles y gestionar tus solicitudes de matrícula.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{loading ? "..." : cursos.length}</p>
                        <p className="text-sm text-slate-500">Cursos Disponibles</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{loading ? "..." : pendientes}</p>
                        <p className="text-sm text-slate-500">Solicitudes Pendientes</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{loading ? "..." : aprobadas}</p>
                        <p className="text-sm text-slate-500">Matrículas Aprobadas</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{loading ? "..." : rechazadas}</p>
                        <p className="text-sm text-slate-500">Solicitudes Rechazadas</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    to="/aspirante/cursos"
                    className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">Explorar Cursos</h3>
                            <p className="text-sm text-slate-500">Ver cursos disponibles para inscribirte</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/aspirante/solicitudes"
                    className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Seguimiento</h3>
                            <p className="text-sm text-slate-500">Revisa el estado de tus solicitudes</p>
                        </div>
                    </div>
                </Link>

                <Link
                    to="/aspirante/credenciales"
                    className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">Credenciales</h3>
                            <p className="text-sm text-slate-500">Consulta tu información de acceso</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Courses */}
            {!loading && cursos.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Cursos Destacados</h2>
                        <Link to="/aspirante/cursos" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cursos.slice(0, 3).map((curso) => (
                            <Link
                                key={curso.id}
                                to={`/aspirante/cursos/${curso.id}`}
                                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                            >
                                {curso.imagen && (
                                    <div className="w-full h-32 rounded-lg bg-slate-100 mb-3 overflow-hidden">
                                        <img src={curso.imagen} alt={curso.nombre} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <h3 className="font-semibold text-slate-800 mb-1">{curso.nombre}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{curso.descripcion || "Sin descripción"}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-emerald-600">${curso.precio}</span>
                                    {curso.paralelos?.length > 0 && (
                                        <span className="text-xs text-slate-400">{curso.paralelos.length} paralelo(s)</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
