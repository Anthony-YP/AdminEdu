import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Award } from "lucide-react";

const NOTA_APROBACION = 7;

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

    const paraleloActual = useMemo(
        () => paralelos.find((p) => String(p.id) === String(paraleloId)) || null,
        [paralelos, paraleloId]
    );

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
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registrar Calificaciones</h1>
                    <p className="text-sm text-gray-500">Nota final (0-10) por estudiante. Aprueba con {NOTA_APROBACION} o más.</p>
                </div>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
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

                {loadingEstudiantes ? (
                    <div className="text-gray-500 text-sm">Cargando estudiantes...</div>
                ) : estudiantes.length > 0 ? (
                    <div>
                        {paraleloActual && (
                            <p className="text-xs text-gray-400 mb-3">{paraleloActual.curso_nombre} - {paraleloActual.nombre} · {estudiantes.length} estudiante(s)</p>
                        )}
                        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                            {estudiantes.map((e) => {
                                const notaActual = notas[e.matricula_id];
                                const notaGuardada = e.nota_final !== undefined && e.nota_final !== null && e.nota_final !== "";
                                const aprobado = notaGuardada && Number(e.nota_final) >= NOTA_APROBACION;
                                return (
                                    <div key={e.matricula_id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50/50">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{e.nombres} {e.apellidos}</p>
                                            <p className="text-xs text-gray-400">{e.numero_identificacion}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {notaGuardada && (
                                                <Badge variant={aprobado ? "green" : "red"}>{aprobado ? "Aprobado" : "Reprobado"}</Badge>
                                            )}
                                            <input
                                                type="number" min="0" max="10" step="0.01"
                                                className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={notaActual ?? ""}
                                                onChange={(ev) => setNotas((prev) => ({ ...prev, [e.matricula_id]: ev.target.value }))}
                                            />
                                            <Button size="sm" onClick={() => handleGuardarNota(e)} isLoading={!!guardando[e.matricula_id]}>
                                                {e.calificacion_final_id ? "Actualizar" : "Guardar"}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : paraleloId ? (
                    <div className="text-gray-500 text-sm">Este paralelo no tiene estudiantes matriculados.</div>
                ) : null}
            </div>
        </div>
    );
}
