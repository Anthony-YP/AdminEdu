import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AspiranteService, { Curso } from "../../services/AspiranteService";

export default function DetalleCurso() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [solicitando, setSolicitando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState("");

    const [paraleloId, setParaleloId] = useState<number | "">("");
    const [comprobante, setComprobante] = useState<File | null>(null);
    const [tipoPago, setTipoPago] = useState("TRANSFERENCIA");
    const [monto, setMonto] = useState("");
    const [numeroRef, setNumeroRef] = useState("");
    const [comentario, setComentario] = useState("");

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

    const formatFecha = (fecha: string) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        } catch (err: any) {
            if (err.response?.data?.codigo === "PERFIL_INCOMPLETO") {
                navigate("/aspirante/completar-perfil");
                return;
            }
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
                    Recibirás una notificación cuando sea revisada por Secretaría.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        to="/aspirante/solicitudes"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Ver Seguimiento
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
        <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {curso?.imagen && (
                    <div className="w-full h-56 overflow-hidden">
                        <img src={curso.imagen} alt={curso.nombre} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">{curso?.nombre}</h1>
                            {curso?.academia_nombre && (
                                <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                                    {curso.academia_nombre}
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-emerald-600">${curso?.precio}</p>
                            <p className="text-xs text-slate-400 mt-1">Precio del curso</p>
                        </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">{curso?.descripcion || "Sin descripción disponible"}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {curso?.fecha_inicio && (
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-400 uppercase font-medium">Fecha Inicio</p>
                                <p className="text-sm font-semibold text-slate-700">{formatFecha(curso.fecha_inicio)}</p>
                            </div>
                        )}
                        {curso?.fecha_fin && (
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-400 uppercase font-medium">Fecha Fin</p>
                                <p className="text-sm font-semibold text-slate-700">{formatFecha(curso.fecha_fin)}</p>
                            </div>
                        )}
                        {curso?.paralelos && (
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-400 uppercase font-medium">Paralelos</p>
                                <p className="text-sm font-semibold text-slate-700">{curso.paralelos.length} disponible(s)</p>
                            </div>
                        )}
                    </div>

                    {/* Paralelos */}
                    {curso?.paralelos && curso.paralelos.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-slate-800 mb-3">Paralelos Disponibles</h3>
                            <div className="space-y-3">
                                {curso.paralelos.map((p) => {
                                    const disponible = p.estado === "ACTIVO";
                                    return (
                                    <div
                                        key={p.id}
                                        className={`border rounded-xl p-4 transition-all duration-200 ${
                                            !disponible
                                                ? "border-slate-200 opacity-60 cursor-not-allowed"
                                                : paraleloId === p.id
                                                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 cursor-pointer"
                                                : "border-slate-200 hover:border-slate-300 cursor-pointer"
                                        }`}
                                        onClick={() => disponible && setParaleloId(p.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                    paraleloId === p.id ? "border-emerald-500" : "border-slate-300"
                                                }`}>
                                                    {paraleloId === p.id && (
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">Paralelo {p.nombre}</p>
                                                    <p className="text-sm text-slate-500">{p.docente_nombre}</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="text-slate-600">{p.dias_clase}</p>
                                                <p className="text-slate-400">{p.hora_inicio} - {p.hora_fin}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 ml-7">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                disponible
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                                {disponible ? "Activo" : "No disponible"}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-2">
                                                Cupos: {p.cupo_max}
                                            </span>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Formulario de Solicitud */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Solicitar Matrícula</h3>

                <div className="space-y-5">
                    {/* Tipo de pago */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Pago</label>
                        <select
                            value={tipoPago}
                            onChange={(e) => setTipoPago(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                        >
                            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                            <option value="EFECTIVO">Efectivo</option>
                        </select>
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Monto ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                        />
                    </div>

                    {/* Número de referencia */}
                    {tipoPago === "TRANSFERENCIA" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Número de Referencia</label>
                            <input
                                type="text"
                                placeholder="Ingrese el número de referencia"
                                value={numeroRef}
                                onChange={(e) => setNumeroRef(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>
                    )}

                    {/* Comprobante */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Comprobante de Pago</label>
                        <p className="text-xs text-slate-400 mb-2">Formatos aceptados: PDF, PNG</p>
                        <input
                            type="file"
                            accept=".pdf,.png,application/pdf,image/png"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {comprobante && (
                            <p className="text-xs text-emerald-600 mt-1">Archivo seleccionado: {comprobante.name}</p>
                        )}
                    </div>

                    {/* Comentario */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Comentario (opcional)</label>
                        <textarea
                            placeholder="Motivo o información adicional..."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSolicitar}
                        disabled={solicitando || !paraleloId}
                        className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                            solicitando || !paraleloId
                                ? "bg-emerald-500/50 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
                        }`}
                    >
                        {solicitando ? "Enviando solicitud..." : "Enviar Solicitud de Matrícula"}
                    </button>
                </div>
            </div>
        </div>
    );
}
