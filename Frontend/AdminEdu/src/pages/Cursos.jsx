import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";


export default function Cursos() {

    const { user, hasGroup } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await api.get("/curso/");
                setCursos(response.data);
            } catch (err) {
                setError("Error al cargar cursos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCursos();
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">Cargando cursos...</div>
            </div>
        );
    }


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Gestión de Cursos
                </h1>
                {hasGroup(['Director', 'Secretaria']) && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                        + Nuevo Curso
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Inicio</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fin</th>
                            {hasGroup(['Director', 'Secretaria']) && (
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {cursos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No hay cursos registrados
                                </td>
                            </tr>
                        ) : (
                            cursos.map((curso) => (
                                <tr key={curso.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{curso.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">${curso.precio}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{curso.fecha_inicio}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{curso.fecha_fin}</td>
                                    {hasGroup(['Director', 'Secretaria']) && (
                                        <td className="px-6 py-4 text-sm">
                                            <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button className="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}