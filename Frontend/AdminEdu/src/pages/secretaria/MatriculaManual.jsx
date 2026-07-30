import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { SearchSelect } from "../../components/ui/SearchSelect";

const NUEVO_ESTUDIANTE_VACIO = {
    tipo_documento: "CEDULA",
    numero_identificacion: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    representante_legal: "",
    direccion: { ciudad: "", calle_principal: "", calle_secundaria: "", numero_casa: "", referencia: "" },
};

export default function MatriculaManual() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [paralelos, setParalelos] = useState([]);
    const [representantes, setRepresentantes] = useState([]);
    const [loadingListas, setLoadingListas] = useState(true);

    const [form, setForm] = useState({
        estudiante: "",
        paralelo_matricula: "",
        tipo_pago: "EFECTIVO",
        monto: "",
        numero_ref: "",
    });
    const [comprobante, setComprobante] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Alta rápida de estudiante nuevo
    const [isNuevoOpen, setIsNuevoOpen] = useState(false);
    const [nuevoEstudiante, setNuevoEstudiante] = useState(NUEVO_ESTUDIANTE_VACIO);
    const [nuevoError, setNuevoError] = useState("");
    const [creandoEstudiante, setCreandoEstudiante] = useState(false);

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        try {
            setLoadingListas(true);
            const [resEst, resPar, resRep] = await Promise.all([
                api.get("/estudiantes/"),
                api.get("/paralelos/"),
                api.get("/representantes/"),
            ]);
            setEstudiantes(resEst.data || []);
            setParalelos(resPar.data || []);
            setRepresentantes(resRep.data || []);
        } catch {
            setError("No se pudieron cargar los estudiantes/paralelos.");
        } finally {
            setLoadingListas(false);
        }
    };

    const extraerMensajeError = (err) => {
        if (err.response?.data) {
            const data = err.response.data;
            if (typeof data === "object" && !data.detail) {
                return Object.entries(data)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : JSON.stringify(v)}`)
                    .join(" | ");
            }
            return data.detail || "Error en la operación.";
        }
        return "Ocurrió un error inesperado.";
    };

    // Estudiantes activos (sin baja) disponibles para matricular, con cédula visible en la búsqueda
    const estudiantesActivos = useMemo(
        () => estudiantes.filter((e) => !e.fecha_baja),
        [estudiantes]
    );

    // Un paralelo desactivado (temporal o permanentemente, por cierre de su
    // curso) no puede recibir matrículas nuevas.
    const paralelosActivos = useMemo(
        () => paralelos.filter((p) => p.estado === "ACTIVO"),
        [paralelos]
    );

    const estudianteOptions = useMemo(
        () => estudiantesActivos.map((e) => ({
            value: e.id.toString(),
            label: `${e.nombres} ${e.apellidos}`,
            sublabel: e.numero_identificacion,
        })),
        [estudiantesActivos]
    );

    const handleCancelar = () => {
        setForm({ estudiante: "", paralelo_matricula: "", tipo_pago: "EFECTIVO", monto: "", numero_ref: "" });
        setComprobante(null);
        setError("");
        setSuccess("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowed = ["application/pdf", "image/png"];
        if (!allowed.includes(file.type)) {
            setError("El comprobante debe ser un archivo PDF o PNG.");
            setComprobante(null);
            return;
        }
        setComprobante(file);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.estudiante || !form.paralelo_matricula) {
            setError("Debe seleccionar el estudiante y el paralelo.");
            return;
        }
        if (form.tipo_pago !== "EFECTIVO" && !comprobante) {
            setError("Debe adjuntar el comprobante de pago.");
            return;
        }
        if (!form.monto || Number(form.monto) <= 0) {
            setError("Debe ingresar un monto válido.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("estudiante", form.estudiante);
            formData.append("paralelo_matricula", form.paralelo_matricula);
            if (comprobante) formData.append("comprobante", comprobante);
            formData.append("tipo_pago", form.tipo_pago);
            formData.append("monto", form.monto);
            if (form.numero_ref) formData.append("numero_ref", form.numero_ref);

            const { data } = await api.post("/matriculas/manual/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess(`Matrícula de ${data.estudiante_nombre} registrada correctamente (${data.estado}).`);
            setForm({ estudiante: "", paralelo_matricula: "", tipo_pago: "EFECTIVO", monto: "", numero_ref: "" });
            setComprobante(null);
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudo registrar la matrícula.");
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Alta rápida de estudiante ──────────────────────────────────────

    const handleOpenNuevo = () => {
        setNuevoEstudiante(NUEVO_ESTUDIANTE_VACIO);
        setNuevoError("");
        setIsNuevoOpen(true);
    };

    const handleSubmitNuevo = async (e) => {
        e.preventDefault();
        setNuevoError("");

        const d = nuevoEstudiante;
        if (!d.numero_identificacion || !d.nombres || !d.apellidos || !d.correo || !d.telefono || !d.fecha_nacimiento) {
            setNuevoError("Complete todos los datos personales.");
            return;
        }
        if (!d.direccion.ciudad || !d.direccion.calle_principal || !d.direccion.calle_secundaria) {
            setNuevoError("Complete los datos de dirección.");
            return;
        }

        const payload = {
            tipo_documento: d.tipo_documento,
            numero_identificacion: d.numero_identificacion,
            nombres: d.nombres,
            apellidos: d.apellidos,
            correo: d.correo,
            telefono: d.telefono,
            fecha_nacimiento: d.fecha_nacimiento,
            direccion: d.direccion,
            representante_legal: d.representante_legal ? Number(d.representante_legal) : null,
        };

        try {
            setCreandoEstudiante(true);
            await api.post("/estudiantes/", payload);

            // El endpoint de creación no devuelve el registro completo (sin "id"),
            // así que recargamos la lista y ubicamos al nuevo estudiante por su
            // número de identificación, que es único.
            const { data: listaActualizada } = await api.get("/estudiantes/");
            setEstudiantes(listaActualizada || []);
            const creado = (listaActualizada || []).find(
                (e) => e.numero_identificacion === d.numero_identificacion
            );

            if (creado) {
                setForm((f) => ({ ...f, estudiante: creado.id.toString() }));
            }
            setIsNuevoOpen(false);
            setSuccess(`Estudiante "${d.nombres} ${d.apellidos}" registrado. Ya puede matricularlo abajo.`);
        } catch (err) {
            setNuevoError(extraerMensajeError(err));
        } finally {
            setCreandoEstudiante(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Matrícula Manual</h1>
                <p className="text-sm text-gray-500 mt-1">Registra manualmente la matrícula de un estudiante en casos excepcionales.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            {loadingListas ? (
                <div className="text-gray-500">Cargando...</div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                    <div>
                        <SearchSelect
                            label="Estudiante"
                            value={form.estudiante}
                            onChange={(value) => setForm((f) => ({ ...f, estudiante: value }))}
                            options={estudianteOptions}
                            placeholder="Buscar por nombre o cédula..."
                            emptyText="No se encontró ningún estudiante con ese nombre o cédula."
                            required
                            onCreateNew={handleOpenNuevo}
                            createNewLabel="+ Registrar estudiante nuevo"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            ¿El estudiante no existe todavía? Use "Registrar estudiante nuevo" dentro del buscador.
                        </p>
                    </div>

                    <Select
                        label="Paralelo"
                        value={form.paralelo_matricula}
                        onChange={(e) => setForm((f) => ({ ...f, paralelo_matricula: e.target.value }))}
                        required
                        options={paralelosActivos.map((p) => ({
                            value: p.id.toString(),
                            label: `${p.curso_nombre ? p.curso_nombre + " - " : ""}${p.nombre} (cupo ${p.cupo_max})`,
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)<span className="text-red-500 ml-0.5">*</span></label>
                            <input
                                type="number" step="0.01" min="0"
                                className="w-full rounded border px-3 py-2 text-sm"
                                value={form.monto}
                                onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))}
                                required
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

                    {form.tipo_pago !== "EFECTIVO" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comprobante de pago (PDF o PNG)<span className="text-red-500 ml-0.5">*</span></label>
                            <input type="file" accept=".pdf,.png,application/pdf,image/png" onChange={handleFileChange} className="text-sm" />
                            {comprobante && <p className="text-xs text-emerald-600 mt-1">Archivo: {comprobante.name}</p>}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button type="button" variant="secondary" onClick={handleCancelar} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" isLoading={submitting}>Registrar matrícula</Button>
                    </div>
                </form>
            )}

            {/* ─── MODAL: Registrar estudiante nuevo ─────────────────── */}
            {isNuevoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
                        <button
                            onClick={() => setIsNuevoOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar Estudiante Nuevo</h2>

                        <form onSubmit={handleSubmitNuevo} className="space-y-4">
                            {nuevoError && <Alert variant="error">{nuevoError}</Alert>}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Tipo de documento"
                                    value={nuevoEstudiante.tipo_documento}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, tipo_documento: e.target.value }))}
                                    options={[{ value: "CEDULA", label: "Cédula" }, { value: "PASAPORTE", label: "Pasaporte" }]}
                                    required
                                />
                                <Input
                                    label="Número de identificación"
                                    value={nuevoEstudiante.numero_identificacion}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, numero_identificacion: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Nombres"
                                    value={nuevoEstudiante.nombres}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, nombres: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Apellidos"
                                    value={nuevoEstudiante.apellidos}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, apellidos: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Correo"
                                    type="email"
                                    value={nuevoEstudiante.correo}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, correo: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Teléfono"
                                    value={nuevoEstudiante.telefono}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, telefono: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Fecha de nacimiento"
                                    type="date"
                                    value={nuevoEstudiante.fecha_nacimiento}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, fecha_nacimiento: e.target.value }))}
                                    required
                                />
                                <Select
                                    label="Representante legal (si es menor de edad)"
                                    value={nuevoEstudiante.representante_legal}
                                    onChange={(e) => setNuevoEstudiante((f) => ({ ...f, representante_legal: e.target.value }))}
                                    options={representantes.map((r) => ({
                                        value: r.id.toString(),
                                        label: `${r.nombres} ${r.apellidos} (${r.numero_identificacion})`,
                                    }))}
                                    placeholder="Sin representante"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Dirección</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Ciudad"
                                        value={nuevoEstudiante.direccion.ciudad}
                                        onChange={(e) => setNuevoEstudiante((f) => ({ ...f, direccion: { ...f.direccion, ciudad: e.target.value } }))}
                                        required
                                    />
                                    <Input
                                        label="Calle principal"
                                        value={nuevoEstudiante.direccion.calle_principal}
                                        onChange={(e) => setNuevoEstudiante((f) => ({ ...f, direccion: { ...f.direccion, calle_principal: e.target.value } }))}
                                        required
                                    />
                                    <Input
                                        label="Calle secundaria"
                                        value={nuevoEstudiante.direccion.calle_secundaria}
                                        onChange={(e) => setNuevoEstudiante((f) => ({ ...f, direccion: { ...f.direccion, calle_secundaria: e.target.value } }))}
                                        required
                                    />
                                    <Input
                                        label="Número de casa"
                                        value={nuevoEstudiante.direccion.numero_casa}
                                        onChange={(e) => setNuevoEstudiante((f) => ({ ...f, direccion: { ...f.direccion, numero_casa: e.target.value } }))}
                                    />
                                    <Input
                                        label="Referencia"
                                        value={nuevoEstudiante.direccion.referencia}
                                        onChange={(e) => setNuevoEstudiante((f) => ({ ...f, direccion: { ...f.direccion, referencia: e.target.value } }))}
                                        className="sm:col-span-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={() => setIsNuevoOpen(false)} disabled={creandoEstudiante}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" isLoading={creandoEstudiante}>
                                    Registrar y continuar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
