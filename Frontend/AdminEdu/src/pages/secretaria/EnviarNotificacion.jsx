import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { SearchSelect } from "../../components/ui/SearchSelect";

const MODOS = [
    { value: "individual", label: "Persona específica" },
    { value: "todos_estudiantes", label: "Todos los estudiantes" },
    { value: "todos_docentes", label: "Todos los docentes" },
];

export default function EnviarNotificacion() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loadingPersonas, setLoadingPersonas] = useState(true);

    const [modo, setModo] = useState("individual");
    const [usuarioDestino, setUsuarioDestino] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [resEst, resDoc] = await Promise.all([
                    api.get("/estudiantes/"),
                    api.get("/docentes/"),
                ]);
                setEstudiantes((resEst.data || []).filter((e) => e.usuario && !e.fecha_baja));
                setDocentes((resDoc.data || []).filter((d) => d.usuario));
            } catch {
                setError("No se pudieron cargar los destinatarios.");
            } finally {
                setLoadingPersonas(false);
            }
        };
        cargar();
    }, []);

    const destinatarioOptions = useMemo(() => [
        ...estudiantes.map((e) => ({
            value: e.usuario.toString(),
            label: `${e.nombres} ${e.apellidos}`,
            sublabel: `Estudiante · ${e.numero_identificacion}`,
        })),
        ...docentes.map((d) => ({
            value: d.usuario.toString(),
            label: `${d.nombres} ${d.apellidos}`,
            sublabel: `Docente · ${d.numero_identificacion}`,
        })),
    ], [estudiantes, docentes]);

    const destinatariosMasivos = useMemo(() => {
        if (modo === "todos_estudiantes") return estudiantes;
        if (modo === "todos_docentes") return docentes;
        return [];
    }, [modo, estudiantes, docentes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!mensaje.trim()) {
            setError("Debe escribir un mensaje.");
            return;
        }

        if (modo === "individual") {
            if (!usuarioDestino) {
                setError("Debe seleccionar un destinatario.");
                return;
            }
            try {
                setSubmitting(true);
                await api.post("/notificaciones/", {
                    usuario: Number(usuarioDestino),
                    mensaje: mensaje.trim(),
                });
                setSuccess("Notificación enviada correctamente.");
                setMensaje("");
                setUsuarioDestino("");
            } catch (err) {
                setError(err.response?.data?.detail || "No se pudo enviar la notificación.");
            } finally {
                setSubmitting(false);
            }
            return;
        }

        // Envío masivo: a todos los estudiantes o a todos los docentes con cuenta de usuario.
        if (destinatariosMasivos.length === 0) {
            setError("No hay destinatarios con cuenta de usuario para este grupo.");
            return;
        }

        try {
            setSubmitting(true);
            const resultados = await Promise.allSettled(
                destinatariosMasivos.map((persona) =>
                    api.post("/notificaciones/", {
                        usuario: persona.usuario,
                        mensaje: mensaje.trim(),
                    })
                )
            );
            const exitosas = resultados.filter((r) => r.status === "fulfilled").length;
            const fallidas = resultados.length - exitosas;

            if (fallidas === 0) {
                setSuccess(`Notificación enviada a ${exitosas} ${modo === "todos_estudiantes" ? "estudiantes" : "docentes"}.`);
            } else {
                setError(`Se envió a ${exitosas} destinatarios, pero ${fallidas} fallaron. Intente nuevamente.`);
            }
            setMensaje("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Enviar Notificación</h1>
                <p className="text-sm text-gray-500 mt-1">Envía un mensaje a una persona específica o a todo un grupo.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            {loadingPersonas ? (
                <div className="text-gray-500">Cargando...</div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Enviar a</label>
                        <div className="flex flex-wrap gap-2">
                            {MODOS.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => { setModo(m.value); setUsuarioDestino(""); }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                        modo === m.value
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {modo === "individual" ? (
                        <SearchSelect
                            label="Destinatario"
                            value={usuarioDestino}
                            onChange={setUsuarioDestino}
                            options={destinatarioOptions}
                            placeholder="Buscar por nombre o cédula..."
                            emptyText="No se encontró ningún estudiante o docente con ese nombre o cédula."
                            required
                        />
                    ) : (
                        <Alert variant="info">
                            Este mensaje se enviará a {destinatariosMasivos.length} {modo === "todos_estudiantes" ? "estudiante(s)" : "docente(s)"} con cuenta activa.
                        </Alert>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                        <textarea
                            className="w-full rounded border px-3 py-2 text-sm"
                            rows={4}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                        />
                    </div>

                    <Button type="submit" isLoading={submitting}>
                        {modo === "individual" ? "Enviar" : `Enviar a ${destinatariosMasivos.length}`}
                    </Button>
                </form>
            )}
        </div>
    );
}
