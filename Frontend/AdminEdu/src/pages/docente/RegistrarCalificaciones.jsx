import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";

export default function RegistrarCalificaciones() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [paralelos, setParalelos] = useState([]);
    const [paraleloId, setParaleloId] = useState(searchParams.get("paralelo") || "");

    const [estudiantes, setEstudiantes] = useState([]);
    const [notas, setNotas] = useState({});
    const [guardando, setGuardando] = useState({});

    const [loadingParalelos, setLoadingParalelos] = useState(true);
    const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const cargarEstudiantes = async () => {
        if (!paraleloId) {
            setEstudiantes([]);
            return;
        }
        try {
            setLoadingEstudiantes(true);
            setError("");
            const { data } = await api.get(`/paralelos/${paraleloId}/matriculas/`);
            setEstudiantes(data || []);
            setNotas(Object.fromEntries((data || []).map((e) => [e.matricula_id, e.nota_final || ""])));
        } catch {
            setError("No se pudieron cargar los estudiantes de este paralelo.");
        } finally {
            setLoadingEstudiantes(false);
        }
    };

    useEffect(() => {
        cargarEstudiantes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paraleloId]);

    const handleParaleloChange = (id) => {
        setParaleloId(id);
        setSearchParams(id ? { paralelo: id } : {});
    };

    const handleGuardarNota = async (estudiante) => {
        const nota = notas[estudiante.matricula_id];
        setError("");
        setSuccess("");

        if (nota === "" || nota === undefined || Number(nota) < 0 || Number(nota) > 10) {
            setError("Ingrese una nota válida entre 0 y 10.");
            return;
        }

        try {
            setGuardando((g) => ({ ...g, [estudiante.matricula_id]: true }));

            if (estudiante.calificacion_final_id) {
                await api.post(`/calificaciones/${estudiante.calificacion_final_id}/actualizar/`, {
                    nota_final: nota,
                });
            } else {
                await api.post("/calificaciones/registrar/", {
                    matricula_id: estudiante.matricula_id,
                    nota_final: nota,
                });
            }

            setSuccess(`Nota de ${estudiante.nombres} ${estudiante.apellidos} guardada.`);
            cargarEstudiantes();
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudo guardar la nota.");
        } finally {
            setGuardando((g) => ({ ...g, [estudiante.matricula_id]: false }));
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Registrar Calificaciones</h1>
                <p className="text-sm text-gray-500 mt-1">Nota final (0-10) por estudiante.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
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

                {loadingEstudiantes ? (
                    <div className="text-gray-500 text-sm">Cargando estudiantes...</div>
                ) : estudiantes.length > 0 ? (
                    <div className="divide-y divide-gray-100 border rounded-lg">
                        {estudiantes.map((e) => (
                            <div key={e.matricula_id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{e.nombres} {e.apellidos}</p>
                                    <p className="text-xs text-gray-400">{e.numero_identificacion}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number" min="0" max="10" step="0.01"
                                        className="w-20 rounded border px-2 py-1 text-sm text-right"
                                        value={notas[e.matricula_id] ?? ""}
                                        onChange={(ev) => setNotas((prev) => ({ ...prev, [e.matricula_id]: ev.target.value }))}
                                    />
                                    <Button size="sm" onClick={() => handleGuardarNota(e)} isLoading={!!guardando[e.matricula_id]}>
                                        {e.calificacion_final_id ? "Actualizar" : "Guardar"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paraleloId ? (
                    <div className="text-gray-500 text-sm">Este paralelo no tiene estudiantes matriculados.</div>
                ) : null}
            </div>
        </div>
    );
}
