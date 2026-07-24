import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

const TIPOS = {
    Secretaria: { endpoint: "/secretarias/", label: "Secretarias", articulo: "Nueva" },
    Docente: { endpoint: "/docentes/", label: "Docentes", articulo: "Nuevo" },
};

const FORM_VACIO = {
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

const CUENTA_VACIA = { username: "", password: "" };

export default function GestionPersonal() {
    const [tipo, setTipo] = useState("Docente");
    const [registros, setRegistros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(FORM_VACIO);
    const [cuenta, setCuenta] = useState(CUENTA_VACIA);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [cambiandoEstado, setCambiandoEstado] = useState(null);

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
            const [resRegistros, resUsuarios, resGrupos] = await Promise.all([
                api.get(TIPOS[tipo].endpoint),
                api.get("/usuarios/"),
                api.get("/grupos/"),
            ]);
            setRegistros(resRegistros.data || []);
            setUsuarios(resUsuarios.data || []);
            setGrupos(resGrupos.data || []);
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

    // Mapa usuario_id -> cuenta, para mostrar y cambiar el estado activo/inactivo
    const usuariosPorId = useMemo(() => {
        const mapa = new Map();
        usuarios.forEach((u) => mapa.set(u.id, u));
        return mapa;
    }, [usuarios]);

    const registrosFiltrados = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return registros;
        return registros.filter((r) => {
            const nombreCompleto = `${r.nombres} ${r.apellidos}`.toLowerCase();
            return nombreCompleto.includes(q) || (r.numero_identificacion || "").toLowerCase().includes(q);
        });
    }, [registros, busqueda]);

    const handleOpenForm = (registro = null) => {
        setFormError("");
        setCuenta(CUENTA_VACIA);
        if (registro) {
            setEditId(registro.id);
            setForm({
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

        if (!editId) {
            if (!cuenta.username.trim() || !cuenta.password) {
                setFormError("Debe ingresar usuario y contraseña para la nueva cuenta.");
                return;
            }
            if (cuenta.password.length < 8) {
                setFormError("La contraseña debe tener al menos 8 caracteres.");
                return;
            }
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

        try {
            setSubmitting(true);

            if (editId) {
                await api.patch(`${TIPOS[tipo].endpoint}${editId}/`, payload);
                setSuccess(`${tipo} actualizado correctamente.`);
            } else {
                // 1) Crear la cuenta de usuario con el rol correspondiente.
                const grupo = grupos.find((g) => g.name === tipo);
                let nuevoUsuarioId = null;
                try {
                    const { data: nuevoUsuario } = await api.post("/usuarios/", {
                        username: cuenta.username.trim(),
                        password: cuenta.password,
                        groups: grupo ? [grupo.id] : [],
                    });
                    nuevoUsuarioId = nuevoUsuario.id;
                } catch (err) {
                    setFormError(extraerMensajeError(err));
                    setSubmitting(false);
                    return;
                }

                // 2) Crear el registro de persona (Secretaria/Docente) enlazado a esa cuenta.
                try {
                    await api.post(TIPOS[tipo].endpoint, { ...payload, usuario: nuevoUsuarioId });
                    setSuccess(`${tipo} creado correctamente.`);
                } catch (err) {
                    // La cuenta ya se creó pero la persona falló: se revierte
                    // la cuenta para no dejar un usuario huérfano sin datos.
                    await api.delete(`/usuarios/${nuevoUsuarioId}/`).catch(() => {});
                    setFormError(extraerMensajeError(err));
                    setSubmitting(false);
                    return;
                }
            }

            setIsFormOpen(false);
            cargar();
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActivo = async (registro) => {
        const cuentaAsociada = usuariosPorId.get(registro.usuario);
        if (!cuentaAsociada) return;
        try {
            setCambiandoEstado(registro.id);
            const { data } = await api.patch(`/usuarios/${cuentaAsociada.id}/`, { is_active: !cuentaAsociada.is_active });
            setUsuarios((prev) => prev.map((u) => (u.id === data.id ? data : u)));
            setSuccess(`${registro.nombres} ${registro.apellidos} ${data.is_active ? "activado" : "desactivado"}.`);
        } catch (err) {
            setError(extraerMensajeError(err));
        } finally {
            setCambiandoEstado(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
                    <p className="text-sm text-gray-500 mt-1">Crea y edita los registros de Secretaria y Docente.</p>
                </div>
                <Button onClick={() => handleOpenForm()} variant="primary">{TIPOS[tipo].articulo} {tipo}</Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
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
                <div className="relative sm:max-w-xs w-full">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o identificación..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
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
                            <TableHeader>Estado</TableHeader>
                            <TableHeader className="text-right">Acciones</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="text-center text-gray-500 py-8">Cargando...</TableCell></TableRow>
                        ) : registrosFiltrados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                                    {registros.length === 0 ? "No hay registros." : "Nadie coincide con la búsqueda."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            registrosFiltrados.map((r) => {
                                const cuentaAsociada = usuariosPorId.get(r.usuario);
                                const activo = cuentaAsociada ? cuentaAsociada.is_active : null;
                                return (
                                    <TableRow key={r.id} className="hover:bg-gray-50/50">
                                        <TableCell className="font-medium text-gray-900">{r.nombres} {r.apellidos}</TableCell>
                                        <TableCell>{r.numero_identificacion}</TableCell>
                                        <TableCell>{r.correo}</TableCell>
                                        <TableCell>{r.telefono}</TableCell>
                                        {tipo === "Docente" && <TableCell><Badge variant="blue">{r.especialidad}</Badge></TableCell>}
                                        <TableCell>
                                            {activo === null ? (
                                                <span className="text-gray-400 text-xs">Sin cuenta</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleActivo(r)}
                                                    disabled={cambiandoEstado === r.id}
                                                    title={activo ? "Clic para desactivar" : "Clic para activar"}
                                                >
                                                    <Badge variant={activo ? "green" : "red"} className="cursor-pointer">
                                                        {activo ? "Activo" : "Inactivo"}
                                                    </Badge>
                                                </button>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenForm(r)} className="text-blue-600 hover:bg-blue-50">
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">{editId ? `Editar ${tipo}` : `${TIPOS[tipo].articulo} ${tipo}`}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {formError && <Alert variant="error">{formError}</Alert>}

                            {!editId && (
                                <div className="border-b pb-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Cuenta de acceso</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Usuario"
                                            value={cuenta.username}
                                            onChange={(e) => setCuenta((c) => ({ ...c, username: e.target.value }))}
                                            required
                                        />
                                        <Input
                                            label="Contraseña"
                                            type="password"
                                            value={cuenta.password}
                                            onChange={(e) => setCuenta((c) => ({ ...c, password: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Se creará automáticamente con el rol de {tipo} y podrá iniciar sesión con estos datos.
                                    </p>
                                </div>
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
