import { useEffect, useState } from "react";
import api from "../../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

const TIPOS = {
    Director: { endpoint: "/directores/", label: "Directores" },
    Secretaria: { endpoint: "/secretarias/", label: "Secretarias" },
    Docente: { endpoint: "/docentes/", label: "Docentes" },
};

const FORM_VACIO = {
    usuario: "",
    tipo_documento: "CEDULA",
    numero_identificacion: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    titulo: "",
    especialidad: "",
    direccion: { ciudad: "", calle_principal: "", calle_secundaria: "", numero_casa: "", referencia: "" },
};

export default function GestionPersonal() {
    const [tipo, setTipo] = useState("Docente");
    const [registros, setRegistros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(FORM_VACIO);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipo]);

    useEffect(() => {
        if (success || error) {
            const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
            return () => clearTimeout(t);
        }
    }, [success, error]);

    const cargar = async () => {
        try {
            setLoading(true);
            setError("");
            const [resRegistros, resUsuarios] = await Promise.all([
                api.get(TIPOS[tipo].endpoint),
                api.get("/usuarios/"),
            ]);
            setRegistros(resRegistros.data || []);
            setUsuarios(resUsuarios.data || []);
        } catch (err) {
            setError("No se pudieron cargar los datos.");
        } finally {
            setLoading(false);
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

    const handleOpenForm = (registro = null) => {
        setFormError("");
        if (registro) {
            setEditId(registro.id);
            setForm({
                usuario: registro.usuario?.toString() || "",
                tipo_documento: registro.tipo_documento || "CEDULA",
                numero_identificacion: registro.numero_identificacion || "",
                nombres: registro.nombres || "",
                apellidos: registro.apellidos || "",
                correo: registro.correo || "",
                telefono: registro.telefono || "",
                fecha_nacimiento: registro.fecha_nacimiento || "",
                titulo: registro.titulo || "",
                especialidad: registro.especialidad || "",
                direccion: registro.direccion && typeof registro.direccion === "object"
                    ? registro.direccion
                    : { ciudad: "", calle_principal: "", calle_secundaria: "", numero_casa: "", referencia: "" },
            });
        } else {
            setEditId(null);
            setForm(FORM_VACIO);
        }
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!editId && !form.usuario) {
            setFormError("Debe seleccionar la cuenta de usuario asociada.");
            return;
        }
        if (!form.numero_identificacion || !form.nombres || !form.apellidos || !form.correo || !form.telefono || !form.fecha_nacimiento) {
            setFormError("Complete todos los datos personales.");
            return;
        }
        if (!form.direccion.ciudad || !form.direccion.calle_principal || !form.direccion.calle_secundaria) {
            setFormError("Complete los datos de dirección.");
            return;
        }
        if (tipo === "Docente" && (!form.titulo || !form.especialidad)) {
            setFormError("Complete título y especialidad del docente.");
            return;
        }

        const payload = {
            tipo_documento: form.tipo_documento,
            numero_identificacion: form.numero_identificacion,
            nombres: form.nombres,
            apellidos: form.apellidos,
            correo: form.correo,
            telefono: form.telefono,
            fecha_nacimiento: form.fecha_nacimiento,
            direccion: form.direccion,
        };
        if (tipo === "Docente") {
            payload.titulo = form.titulo;
            payload.especialidad = form.especialidad;
        }
        if (!editId) {
            payload.usuario = Number(form.usuario);
        }

        try {
            setSubmitting(true);
            if (editId) {
                await api.patch(`${TIPOS[tipo].endpoint}${editId}/`, payload);
                setSuccess(`${tipo} actualizado correctamente.`);
            } else {
                await api.post(TIPOS[tipo].endpoint, payload);
                setSuccess(`${tipo} creado correctamente.`);
            }
            setIsFormOpen(false);
            cargar();
        } catch (err) {
            setFormError(extraerMensajeError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const usuariosDisponibles = usuarios.filter((u) => !registros.some((r) => r.usuario === u.id));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
                    <p className="text-sm text-gray-500 mt-1">Crea y edita los registros de Director, Secretaria y Docente.</p>
                </div>
                <Button onClick={() => handleOpenForm()} variant="primary">Nuevo {tipo}</Button>
            </div>

            <div className="flex gap-2">
                {Object.keys(TIPOS).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTipo(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            tipo === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {TIPOS[t].label}
                    </button>
                ))}
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader>Nombre</TableHeader>
                            <TableHeader>Identificación</TableHeader>
                            <TableHeader>Correo</TableHeader>
                            <TableHeader>Teléfono</TableHeader>
                            {tipo === "Docente" && <TableHeader>Especialidad</TableHeader>}
                            <TableHeader className="text-right">Acciones</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Cargando...</TableCell></TableRow>
                        ) : registros.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">No hay registros.</TableCell></TableRow>
                        ) : (
                            registros.map((r) => (
                                <TableRow key={r.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-medium text-gray-900">{r.nombres} {r.apellidos}</TableCell>
                                    <TableCell>{r.numero_identificacion}</TableCell>
                                    <TableCell>{r.correo}</TableCell>
                                    <TableCell>{r.telefono}</TableCell>
                                    {tipo === "Docente" && <TableCell><Badge variant="blue">{r.especialidad}</Badge></TableCell>}
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenForm(r)} className="text-blue-600 hover:bg-blue-50">
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">{editId ? `Editar ${tipo}` : `Nuevo ${tipo}`}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {formError && <Alert variant="error">{formError}</Alert>}

                            {!editId && (
                                <Select
                                    label="Cuenta de usuario"
                                    value={form.usuario}
                                    onChange={(e) => setForm((f) => ({ ...f, usuario: e.target.value }))}
                                    required
                                    options={usuariosDisponibles.map((u) => ({ value: u.id.toString(), label: u.username }))}
                                    placeholder="Selecciona una cuenta"
                                />
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Tipo de documento"
                                    value={form.tipo_documento}
                                    onChange={(e) => setForm((f) => ({ ...f, tipo_documento: e.target.value }))}
                                    options={[{ value: "CEDULA", label: "Cédula" }, { value: "PASAPORTE", label: "Pasaporte" }]}
                                />
                                <Input label="Número de identificación" value={form.numero_identificacion} onChange={(e) => setForm((f) => ({ ...f, numero_identificacion: e.target.value }))} />
                                <Input label="Nombres" value={form.nombres} onChange={(e) => setForm((f) => ({ ...f, nombres: e.target.value }))} />
                                <Input label="Apellidos" value={form.apellidos} onChange={(e) => setForm((f) => ({ ...f, apellidos: e.target.value }))} />
                                <Input label="Correo" type="email" value={form.correo} onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))} />
                                <Input label="Teléfono" value={form.telefono} onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />
                                <Input label="Fecha de nacimiento" type="date" value={form.fecha_nacimiento} onChange={(e) => setForm((f) => ({ ...f, fecha_nacimiento: e.target.value }))} />
                            </div>

                            {tipo === "Docente" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Título" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} />
                                    <Input label="Especialidad" value={form.especialidad} onChange={(e) => setForm((f) => ({ ...f, especialidad: e.target.value }))} />
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Dirección</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Ciudad" value={form.direccion.ciudad} onChange={(e) => setForm((f) => ({ ...f, direccion: { ...f.direccion, ciudad: e.target.value } }))} />
                                    <Input label="Calle principal" value={form.direccion.calle_principal} onChange={(e) => setForm((f) => ({ ...f, direccion: { ...f.direccion, calle_principal: e.target.value } }))} />
                                    <Input label="Calle secundaria" value={form.direccion.calle_secundaria} onChange={(e) => setForm((f) => ({ ...f, direccion: { ...f.direccion, calle_secundaria: e.target.value } }))} />
                                    <Input label="Número de casa" value={form.direccion.numero_casa} onChange={(e) => setForm((f) => ({ ...f, direccion: { ...f.direccion, numero_casa: e.target.value } }))} />
                                    <Input label="Referencia" value={form.direccion.referencia} onChange={(e) => setForm((f) => ({ ...f, direccion: { ...f.direccion, referencia: e.target.value } }))} className="sm:col-span-2" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)} disabled={submitting}>Cancelar</Button>
                                <Button type="submit" variant="primary" isLoading={submitting}>{editId ? "Guardar cambios" : "Crear"}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
