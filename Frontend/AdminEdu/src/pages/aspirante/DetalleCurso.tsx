import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AspiranteService, { Curso } from "../../services/AspiranteService";

export default function DetalleCurso() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [solicitando, setSolicitando] = useState(false);
    const [comentario, setComentario] = useState("");
    const [exito, setExito] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const data = await AspiranteService.getCurso(Number(id));
                setCurso(data);
            } catch {
                setError("No se pudo cargar el curso.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function handleSolicitar() {
        setSolicitando(true);
        setError("");
        try {
            await AspiranteService.solicitarMatricula(Number(id), comentario);
            setExito(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Error al enviar la solicitud.");
        } finally {
            setSolicitando(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
            </div>
        );
    }

    if (!curso && error) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link to="/aspirante/cursos" className="text-emerald-600 hover:underline">
                    Volver a cursos
                </Link>
            </div>
        );
    }

    if (exito) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Solicitud Enviada</h2>
                <p className="text-slate-500 mb-6">
                    Tu solicitud de matrícula para <strong>{curso?.nombre}</strong> ha sido enviada correctamente.
                    Recibirás una notificación cuando sea revisada.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        to="/aspirante/solicitudes"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Ver Mis Solicitudes
                    </Link>
                    <Link
                        to="/aspirante/cursos"
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                        Seguir Explorando
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Back */}
            <Link
                to="/aspirante/cursos"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a cursos
            </Link>

            {/* Course Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">{curso?.nombre}</h1>
                <p className="text-slate-600 mb-6">{curso?.descripcion || "Sin descripción disponible"}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {curso?.duracion && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-400 uppercase font-medium">Duración</p>
                            <p className="text-sm font-semibold text-slate-700">{curso.duracion}</p>
                        </div>
                    )}
                    {curso?.academia_nombre && (
                        <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-400 uppercase font-medium">Academia</p>
                            <p className="text-sm font-semibold text-slate-700">{curso.academia_nombre}</p>
                        </div>
                    )}
                </div>

                {/* Solicitar */}
                <div className="border-t border-slate-100 pt-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Solicitar Matrícula</h3>
                    <textarea
                        placeholder="Motivo de la solicitud (opcional)"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none mb-4 transition-all"
                    />
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleSolicitar}
                        disabled={solicitando}
                        className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                            solicitando
                                ? "bg-emerald-500/50 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
                        }`}
                    >
                        {solicitando ? "Enviando..." : "Solicitar Matrícula"}
                    </button>
                </div>
            </div>
        </div>
    );
}
