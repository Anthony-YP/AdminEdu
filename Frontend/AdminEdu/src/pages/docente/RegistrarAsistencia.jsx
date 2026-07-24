import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";

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

    const handleParaleloChange = (id) => {
        setParaleloId(id);
        setSearchParams(id ? { paralelo: id } : {});
    };

    const togglePresente = (matriculaId) => {
        setPresentes((prev) => ({ ...prev, [matriculaId]: !prev[matriculaId] }));
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
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Registrar Asistencia</h1>
                <p className="text-sm text-gray-500 mt-1">Pase de lista para uno de tus paralelos.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paralelo</label>
                        <select
                            className="w-full rounded border px-3 py-2 text-sm"
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
                            className="w-full rounded border px-3 py-2 text-sm"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                </div>

                {loadingEstudiantes ? (
                    <div className="text-gray-500 text-sm">Cargando estudiantes...</div>
                ) : estudiantes.length > 0 ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="divide-y divide-gray-100 border rounded-lg">
                            {estudiantes.map((e) => (
                                <label key={e.matricula_id} className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{e.nombres} {e.apellidos}</p>
                                        <p className="text-xs text-gray-400">{e.numero_identificacion}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!presentes[e.matricula_id]}
                                        onChange={() => togglePresente(e.matricula_id)}
                                        className="w-5 h-5 accent-blue-600"
                                    />
                                </label>
                            ))}
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
