import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AspiranteService from "../services/AspiranteService";

export default function EstudianteCursosDisponibles() {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [imagenesConError, setImagenesConError] = useState({});

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Cursos Disponibles</h1>
                <p className="text-gray-500 mt-1">Explora la oferta académica y solicita una nueva matrícula.</p>
            </div>

            <div className="relative max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
                </div>
            ) : cursosFiltrados.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                    No hay cursos disponibles.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cursosFiltrados.map((curso) => (
                        <Link
                            key={curso.id}
                            to={`/estudiante-cursos/${curso.id}`}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
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
                                <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors flex-1">
                                        {curso.nombre}
                                    </h3>
                                    <span className="text-lg font-bold text-blue-600 ml-2 whitespace-nowrap">
                                        ${curso.precio}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {curso.descripcion || "Sin descripción disponible"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
