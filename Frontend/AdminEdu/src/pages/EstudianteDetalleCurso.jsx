import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AspiranteService from "../services/AspiranteService";

export default function EstudianteDetalleCurso() {
    const { id } = useParams();
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solicitando, setSolicitando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState("");

    const [paraleloId, setParaleloId] = useState("");
    const [comprobante, setComprobante] = useState(null);
    const [tipoPago, setTipoPago] = useState("TRANSFERENCIA");
    const [monto, setMonto] = useState("");
    const [numeroRef, setNumeroRef] = useState("");
    const [comentario, setComentario] = useState("");
    const [imagenConError, setImagenConError] = useState(false);

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

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ["application/pdf", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                setError("El comprobante debe ser de tipo PDF o PNG.");
                setComprobante(null);
                return;
            }
            setComprobante(file);
            setError("");
        }
    };

    async function handleSolicitar() {
        if (!paraleloId) {
            setError("Debe seleccionar un paralelo.");
            return;
        }
        if (!comprobante) {
            setError("Debe adjuntar el comprobante de pago.");
            return;
        }
        if (!monto || parseFloat(monto) <= 0) {
            setError("Debe ingresar un monto válido.");
            return;
        }
        if (tipoPago === "TRANSFERENCIA" && !numeroRef.trim()) {
            setError("Debe ingresar el número de referencia para transferencia.");
            return;
        }

        setSolicitando(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("paralelo_id", String(paraleloId));
            formData.append("comprobante", comprobante);
            formData.append("tipo_pago", tipoPago);
            formData.append("monto", monto);
            formData.append("numero_ref", numeroRef);
            formData.append("comentario", comentario);

            await AspiranteService.solicitarMatricula(formData);
            setExito(true);
        } catch (err) {
            setError(err.response?.data?.detail || "Error al enviar la solicitud.");
        } finally {
            setSolicitando(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!curso && error) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link to="/estudiante-cursos" className="text-blue-600 hover:underline">Volver a cursos</Link>
            </div>
        );
    }

    if (exito) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Solicitud Enviada</h2>
                <p className="text-gray-500 mb-6">
                    Tu solicitud de matrícula para <strong>{curso?.nombre}</strong> fue enviada correctamente.
                </p>
                <Link to="/estudiante-matriculas" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                    Ver Mis Matrículas
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/estudiante-cursos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a cursos
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {curso?.imagen && !imagenConError && (
                    <div className="w-full h-56 overflow-hidden">
                        <img
                            src={curso.imagen}
                            alt={curso.nombre}
                            className="w-full h-full object-cover"
                            onError={() => setImagenConError(true)}
                        />
                    </div>
                )}
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">{curso?.nombre}</h1>
                        <p className="text-3xl font-bold text-blue-600">${curso?.precio}</p>
                    </div>
                    <p className="text-gray-600 mb-6">{curso?.descripcion || "Sin descripción disponible"}</p>

                    {curso?.paralelos?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Paralelos Disponibles</h3>
                            <div className="space-y-3">
                                {curso.paralelos.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                                            paraleloId === p.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => setParaleloId(p.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-800">Paralelo {p.nombre}</p>
                                                <p className="text-sm text-gray-500">{p.docente_nombre}</p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="text-gray-600">{Array.isArray(p.dias_clase) ? p.dias_clase.join(", ") : p.dias_clase}</p>
                                                <p className="text-gray-400">{p.hora_inicio} - {p.hora_fin}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Solicitar Matrícula</h3>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Pago</label>
                        <select
                            value={tipoPago}
                            onChange={(e) => setTipoPago(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                            <option value="EFECTIVO">Efectivo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Monto ($)</label>
                        <input
                            type="number" step="0.01" min="0" placeholder="0.00"
                            value={monto} onChange={(e) => setMonto(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                    {tipoPago === "TRANSFERENCIA" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de Referencia</label>
                            <input
                                type="text" value={numeroRef} onChange={(e) => setNumeroRef(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Comprobante de Pago</label>
                        <p className="text-xs text-gray-400 mb-2">Formatos aceptados: PDF, PNG</p>
                        <input type="file" accept=".pdf,.png,application/pdf,image/png" onChange={handleFileChange} className="text-sm" />
                        {comprobante && <p className="text-xs text-emerald-600 mt-1">Archivo: {comprobante.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Comentario (opcional)</label>
                        <textarea
                            value={comentario} onChange={(e) => setComentario(e.target.value)} rows={3}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                        />
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

                    <button
                        onClick={handleSolicitar}
                        disabled={solicitando || !paraleloId}
                        className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                            solicitando || !paraleloId ? "bg-blue-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {solicitando ? "Enviando..." : "Enviar Solicitud de Matrícula"}
                    </button>
                </div>
            </div>
        </div>
    );
}
