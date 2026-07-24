import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AspiranteService, { Curso } from "../../services/AspiranteService";

export default function CursosDisponibles() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [imagenesConError, setImagenesConError] = useState<Record<number, boolean>>({});

    useEffect(() => {
        async function load() {
            try {
                const data = await AspiranteService.getCursos();
                setCursos(data);
            } catch {
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const cursosFiltrados = cursos.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    );

    const formatFecha = (fecha: string) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Cursos Disponibles</h1>
                <p className="text-slate-500 mt-1">Explora los cursos abiertos para nueva inscripción</p>
            </div>

            {/* Búsqueda */}
            <div className="relative max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar cursos por nombre o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : cursosFiltrados.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium">No hay cursos disponibles</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {busqueda ? "Intenta con otros términos de búsqueda" : "No se han publicado cursos aún"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cursosFiltrados.map((curso) => (
                        <Link
                            key={curso.id}
                            to={`/aspirante/cursos/${curso.id}`}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group"
                        >
                            {curso.imagen && !imagenesConError[curso.id] ? (
                                <div className="w-full h-40 overflow-hidden">
                                    <img
                                        src={curso.imagen}
                                        alt={curso.nombre}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={() => setImagenesConError((prev) => ({ ...prev, [curso.id]: true }))}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex-1">
                                        {curso.nombre}
                                    </h3>
                                    <span className="text-lg font-bold text-emerald-600 ml-2 whitespace-nowrap">
                                        ${curso.precio}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                    {curso.descripcion || "Sin descripción disponible"}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {curso.academia_nombre && (
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                                            {curso.academia_nombre}
                                        </span>
                                    )}
                                    {curso.paralelos?.length > 0 && (
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                                            {curso.paralelos.length} paralelo(s)
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                                    {curso.fecha_inicio && (
                                        <span>Inicio: {formatFecha(curso.fecha_inicio)}</span>
                                    )}
                                    {curso.fecha_fin && (
                                        <span>Fin: {formatFecha(curso.fecha_fin)}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
