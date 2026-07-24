import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { ClipboardCheck, Check, X } from "lucide-react";

export default function RegistrarAsistencia() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [paralelos, setParalelos] = useState([]);
    const [paraleloId, setParaleloId] = useState(searchParams.get("paralelo") || "");
    const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

    const [estudiantes, setEstudiantes] = useState([]);
    const [presentes, setPresentes] = useState({});

    const [loadingParalelos, setLoadingParalelos] = useState(true);
    const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const cargarParalelos = async () => {
            try {
                const { data } = await api.get("/docentes/mis-paralelos/");
                setParalelos(data || []);
            } catch {
                setError("No se pudieron cargar tus paralelos.");
            } finally {
                setLoadingParalelos(false);
            }
        };
        cargarParalelos();
    }, []);

    useEffect(() => {
        if (!paraleloId) {
            setEstudiantes([]);
            return;
        }
        const cargarEstudiantes = async () => {
            try {
                setLoadingEstudiantes(true);
                setError("");
                const { data } = await api.get(`/paralelos/${paraleloId}/matriculas/`);
                setEstudiantes(data || []);
                setPresentes(Object.fromEntries((data || []).map((e) => [e.matricula_id, true])));
            } catch {
                setError("No se pudieron cargar los estudiantes de este paralelo.");
            } finally {
                setLoadingEstudiantes(false);
            }
        };
        cargarEstudiantes();
    }, [paraleloId]);

    const paraleloActual = useMemo(
        () => paralelos.find((p) => String(p.id) === String(paraleloId)) || null,
        [paralelos, paraleloId]
    );

    const totalPresentes = useMemo(
        () => estudiantes.filter((e) => presentes[e.matricula_id]).length,
        [estudiantes, presentes]
    );

    const handleParaleloChange = (id) => {
        setParaleloId(id);
        setSearchParams(id ? { paralelo: id } : {});
    };

    const togglePresente = (matriculaId) => {
        setPresentes((prev) => ({ ...prev, [matriculaId]: !prev[matriculaId] }));
    };

    const marcarTodos = (valor) => {
        setPresentes(Object.fromEntries(estudiantes.map((e) => [e.matricula_id, valor])));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!paraleloId || estudiantes.length === 0) {
            setError("Selecciona un paralelo con estudiantes.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post("/asistencias/registrar/", {
                paralelo_id: Number(paraleloId),
                fecha,
                registros: estudiantes.map((e) => ({
                    matricula_id: e.matricula_id,
                    presente: !!presentes[e.matricula_id],
                })),
            });
            setSuccess(`Asistencia del ${fecha} registrada para ${estudiantes.length} estudiante(s).`);
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudo registrar la asistencia.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registrar Asistencia</h1>
                    <p className="text-sm text-gray-500">Pase de lista para uno de tus paralelos.</p>
                </div>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paralelo</label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={paraleloId}
                            onChange={(e) => handleParaleloChange(e.target.value)}
                            disabled={loadingParalelos}
                        >
                            <option value="">Selecciona un paralelo</option>
                            {paralelos.map((p) => (
                                <option key={p.id} value={p.id}>{p.curso_nombre} - {p.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                </div>

                {loadingEstudiantes ? (
                    <div className="text-gray-500 text-sm">Cargando estudiantes...</div>
                ) : estudiantes.length > 0 ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-emerald-600">{totalPresentes}</span> presentes ·{" "}
                                <span className="font-semibold text-red-600">{estudiantes.length - totalPresentes}</span> ausentes
                                {paraleloActual && (
                                    <span className="text-gray-400"> · {paraleloActual.curso_nombre} - {paraleloActual.nombre}</span>
                                )}
                            </p>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => marcarTodos(true)} className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                                    Marcar todos presentes
                                </button>
                                <button type="button" onClick={() => marcarTodos(false)} className="text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                                    Marcar todos ausentes
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                            {estudiantes.map((e) => {
                                const presente = !!presentes[e.matricula_id];
                                return (
                                    <div key={e.matricula_id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${presente ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                                {e.nombres?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{e.nombres} {e.apellidos}</p>
                                                <p className="text-xs text-gray-400">{e.numero_identificacion}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => togglePresente(e.matricula_id)}
                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0 ${
                                                presente
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                            }`}
                                        >
                                            {presente ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                            {presente ? "Presente" : "Ausente"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <Button type="submit" isLoading={submitting}>Guardar asistencia</Button>
                    </form>
                ) : paraleloId ? (
                    <div className="text-gray-500 text-sm">Este paralelo no tiene estudiantes matriculados.</div>
                ) : null}
            </div>
        </div>
    );
}
