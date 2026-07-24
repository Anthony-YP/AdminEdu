import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { RefreshCcw, X } from "lucide-react";

const ESTADOS = [
    { value: "TODAS", label: "Todas" },
    { value: "Pendiente", label: "Pendientes" },
    { value: "Aprobada", label: "Aprobadas" },
    { value: "Rechazada", label: "Rechazadas" },
    { value: "Cancelada", label: "Canceladas" },
    { value: "Finalizada", label: "Finalizadas" },
];

const ESTADO_VARIANT = {
    Pendiente: "yellow",
    Aprobada: "green",
    Rechazada: "red",
    Cancelada: "red",
    Finalizada: "blue",
};

export default function EstudianteMatriculas() {
    const [matriculas, setMatriculas] = useState([]);
    const [paralelos, setParalelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [filtro, setFiltro] = useState("TODAS");

    // Reenvío de una matrícula rechazada
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ paralelo_matricula: "", tipo_pago: "EFECTIVO", monto: "", numero_ref: "" });
    const [comprobante, setComprobante] = useState(null);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        cargar();
    }, []);

    useEffect(() => {
        if (success || error) {
            const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
            return () => clearTimeout(t);
        }
    }, [success, error]);

    const cargar = async () => {
        try {
            setLoading(true);
            const [resMat, resPar] = await Promise.all([
                api.get("/matriculas/"),
                api.get("/paralelos/"),
            ]);
            setMatriculas(resMat.data || []);
            setParalelos(resPar.data || []);
        } catch (err) {
            setError("No se pudieron cargar las matrículas.");
        } finally {
            setLoading(false);
        }
    };

    const matriculasFiltradas = useMemo(() => {
        if (filtro === "TODAS") return matriculas;
        return matriculas.filter((m) => m.estado === filtro);
    }, [matriculas, filtro]);

    // Paralelos activos del mismo curso, para elegir al reenviar (permite
    // cambiar de sección sin perder de vista que es el mismo curso).
    const paralelosDisponibles = useMemo(() => {
        if (!modal) return [];
        return paralelos.filter((p) => p.estado === "ACTIVO" && p.curso === modal.curso_id);
    }, [paralelos, modal]);

    const abrirReenvio = (matricula) => {
        setModal(matricula);
        setForm({
            paralelo_matricula: matricula.paralelo_matricula.toString(),
            tipo_pago: "EFECTIVO",
            monto: "",
            numero_ref: "",
        });
        setComprobante(null);
        setFormError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowed = ["application/pdf", "image/png"];
        if (!allowed.includes(file.type)) {
            setFormError("El comprobante debe ser un archivo PDF o PNG.");
            setComprobante(null);
            return;
        }
        setComprobante(file);
        setFormError("");
    };

    const handleReenviar = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!form.paralelo_matricula) {
            setFormError("Debe seleccionar un paralelo.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("paralelo_matricula", form.paralelo_matricula);
            if (form.monto) formData.append("monto", form.monto);
            formData.append("tipo_pago", form.tipo_pago);
            if (form.numero_ref) formData.append("numero_ref", form.numero_ref);
            if (comprobante) formData.append("comprobante", comprobante);

            const { data } = await api.post(`/matriculas/${modal.id}/reenviar/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMatriculas((prev) => prev.map((m) => (m.id === data.id ? { ...m, ...data } : m)));
            setSuccess(`Matrícula de ${data.curso_nombre} reenviada. Vuelve a estar pendiente de revisión.`);
            setModal(null);
        } catch (err) {
            setFormError(err.response?.data?.detail || "No se pudo reenviar la matrícula.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Matrículas</h1>
                <p className="text-sm text-gray-500">Consulta el estado de tus solicitudes y los comentarios de revisión.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="flex flex-wrap gap-2">
                {ESTADOS.map((e) => (
                    <button
                        key={e.value}
                        onClick={() => setFiltro(e.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            filtro === e.value
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {e.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-gray-500">Cargando matrículas...</div>
            ) : matriculasFiltradas.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-12 text-center text-gray-500">
                    {matriculas.length === 0
                        ? "Aún no tienes matrículas registradas. Cuando solicites una aparecerá aquí."
                        : "No hay matrículas con este estado."}
                </div>
            ) : (
                <div className="space-y-3">
                    {matriculasFiltradas.map((m) => (
                        <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <p className="font-semibold text-gray-900">{m.curso_nombre || "Curso"}</p>
                                    <p className="text-sm text-gray-500">Paralelo: {m.paralelo_nombre || "—"}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Solicitada el {m.fecha_solicitud}</p>
                                </div>
                                <Badge variant={ESTADO_VARIANT[m.estado] || "gray"}>{m.estado || "Pendiente"}</Badge>
                            </div>
                            {m.comentario && (
                                <p className="mt-2 text-sm text-red-600">
                                    {m.estado === "Rechazada" ? "Motivo del rechazo: " : "Comentario: "}
                                    {m.comentario}
                                </p>
                            )}
                            {m.estado === "Rechazada" && (
                                <div className="mt-3 border-t border-gray-100 pt-3">
                                    <Button variant="secondary" size="sm" onClick={() => abrirReenvio(m)}>
                                        <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
                                        Editar y reenviar
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ─── MODAL: Reenviar matrícula rechazada ─────────────────── */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 my-8">
                        <button
                            onClick={() => setModal(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-lg font-bold text-gray-900 mb-1">Reenviar matrícula</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {modal.curso_nombre} — se enviará nuevamente como pendiente de revisión.
                        </p>

                        <form onSubmit={handleReenviar} className="space-y-4">
                            {formError && <Alert variant="error">{formError}</Alert>}

                            <Select
                                label="Paralelo"
                                value={form.paralelo_matricula}
                                onChange={(e) => setForm((f) => ({ ...f, paralelo_matricula: e.target.value }))}
                                required
                                options={paralelosDisponibles.map((p) => ({
                                    value: p.id.toString(),
                                    label: `${p.nombre} (cupo ${p.cupo_max})`,
                                }))}
                                placeholder="Selecciona un paralelo"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de pago</label>
                                    <select
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        value={form.tipo_pago}
                                        onChange={(e) => setForm((f) => ({ ...f, tipo_pago: e.target.value }))}
                                    >
                                        <option value="EFECTIVO">Efectivo</option>
                                        <option value="TRANSFERENCIA">Transferencia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                                    <input
                                        type="number" step="0.01" min="0"
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        value={form.monto}
                                        onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))}
                                        placeholder="Dejar igual si no cambió"
                                    />
                                </div>
                            </div>

                            {form.tipo_pago === "TRANSFERENCIA" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de referencia</label>
                                    <input
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        value={form.numero_ref}
                                        onChange={(e) => setForm((f) => ({ ...f, numero_ref: e.target.value }))}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo comprobante de pago (opcional)</label>
                                <p className="text-xs text-gray-400 mb-1.5">Si no subes uno nuevo, se conserva el comprobante actual.</p>
                                <input type="file" accept=".pdf,.png,application/pdf,image/png" onChange={handleFileChange} className="text-sm" />
                                {comprobante && <p className="text-xs text-emerald-600 mt-1">Archivo: {comprobante.name}</p>}
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={() => setModal(null)} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" isLoading={submitting}>
                                    Reenviar matrícula
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
