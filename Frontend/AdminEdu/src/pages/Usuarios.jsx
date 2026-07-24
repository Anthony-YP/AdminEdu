import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";

export default function Usuarios() {
    const { user, hasGroup } = useAuth();
    const navigate = useNavigate();
    const esDirector = hasGroup(["Director"]);

    // Estado principal
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]); // Lista de grupos disponibles
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal de edición de rol
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [usuarioEdit, setUsuarioEdit] = useState(null);
    const [editForm, setEditForm] = useState({ groups: [] });
    const [submitting, setSubmitting] = useState(false);
    const [editError, setEditError] = useState("");

    // Modal de eliminación (doble confirmación)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Activar/Desactivar
    const [cambiandoEstado, setCambiandoEstado] = useState(null);

    // Modal de creación de usuario
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ username: "", password: "", email: "", groups: [] });
    const [createError, setCreateError] = useState("");
    const [creating, setCreating] = useState(false);

    // Cargar datos al montar
    useEffect(() => {
        if (!esDirector) {
            // Si no es director, mostramos mensaje o redirigimos
            setError("No tienes permisos para ver esta página.");
            setLoading(false);
            return;
        }
        cargarUsuarios();
        cargarRoles();
    }, [esDirector]);

    // Auto‑limpiar mensajes
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess("");
                setError("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    // ─── Funciones de API ──────────────────────────────────────────────

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/usuarios/"); // Ajusta la ruta según tu API
            setUsuarios(response.data);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            setError("No se pudieron cargar los usuarios. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const cargarRoles = async () => {
        try {
            const response = await api.get("/grupos/"); // Endpoint para obtener grupos
            setRoles(response.data);
        } catch (err) {
            console.error("Error al cargar roles:", err);
            // No mostramos error fatal, solo dejamos vacío
        }
    };

    const extraerMensajeError = (err) => {
        if (err.response?.data) {
            const data = err.response.data;
            if (typeof data === 'object' && !data.detail) {
                return Object.keys(data)
                    .map((key) => {
                        const msgs = Array.isArray(data[key]) ? data[key].join(", ") : data[key];
                        return `${key}: ${msgs}`;
                    })
                    .join(" | ");
            }
            return data.detail || "Error en la operación.";
        }
        return "Ocurrió un error inesperado.";
    };

    // ─── Edición de rol ─────────────────────────────────────────────────

    const handleOpenEdit = (usuario) => {
        setUsuarioEdit(usuario);
        // Extraer IDs de grupos actuales
        const currentGroups = usuario.groups_detail ? usuario.groups_detail.map(g => g.id) : [];
        setEditForm({ groups: currentGroups });
        setEditError("");
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setUsuarioEdit(null);
        setEditError("");
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setEditError("");

        // Validar que al menos se haya seleccionado un grupo
        if (!editForm.groups || editForm.groups.length === 0) {
            setEditError("Debe seleccionar al menos un rol.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                groups: editForm.groups // Enviar lista de IDs
            };
            const response = await api.patch(`/usuarios/${usuarioEdit.id}/`, payload);
            // Actualizar la lista local
            setUsuarios(usuarios.map(u => u.id === usuarioEdit.id ? response.data : u));
            setSuccess(`Rol de "${response.data.username}" actualizado exitosamente.`);
            handleCloseEdit();
        } catch (err) {
            console.error("Error al actualizar rol:", err);
            setEditError(extraerMensajeError(err));
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Activar/Desactivar ─────────────────────────────────────────────

    const handleToggleActivo = async (usuario) => {
        try {
            setCambiandoEstado(usuario.id);
            const response = await api.patch(`/usuarios/${usuario.id}/`, { is_active: !usuario.is_active });
            setUsuarios(usuarios.map(u => u.id === usuario.id ? response.data : u));
            setSuccess(`Usuario "${usuario.username}" ${response.data.is_active ? "activado" : "desactivado"}.`);
        } catch (err) {
            setError(extraerMensajeError(err));
        } finally {
            setCambiandoEstado(null);
        }
    };

    // ─── Creación de usuario ────────────────────────────────────────────

    const handleOpenCreate = () => {
        setCreateForm({ username: "", password: "", email: "", groups: [] });
        setCreateError("");
        setIsCreateOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setCreateError("");

        if (!createForm.username.trim() || !createForm.password) {
            setCreateError("Usuario y contraseña son obligatorios.");
            return;
        }
        if (createForm.password.length < 8) {
            setCreateError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (!createForm.groups || createForm.groups.length === 0) {
            setCreateError("Debe seleccionar al menos un rol. Sin un rol, el usuario no podrá acceder a ninguna sección tras iniciar sesión.");
            return;
        }

        try {
            setCreating(true);
            await api.post("/usuarios/", {
                username: createForm.username.trim(),
                password: createForm.password,
                email: createForm.email.trim(),
                groups: createForm.groups.map(Number),
            });
            setSuccess(`Usuario "${createForm.username}" creado exitosamente.`);
            setIsCreateOpen(false);
            cargarUsuarios();
        } catch (err) {
            setCreateError(extraerMensajeError(err));
        } finally {
            setCreating(false);
        }
    };

    // ─── Eliminación ────────────────────────────────────────────────────

    const confirmDelete = (usuario) => {
        setUsuarioToDelete(usuario);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!usuarioToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/usuarios/${usuarioToDelete.id}/`);
            setUsuarios(usuarios.filter(u => u.id !== usuarioToDelete.id));
            setSuccess(`Usuario "${usuarioToDelete.username}" eliminado exitosamente.`);
            setIsDeleteOpen(false);
            setUsuarioToDelete(null);
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            let msg = "No se pudo eliminar el usuario.";
            if (err.response?.status === 409 || err.response?.data?.detail?.includes("relacionados")) {
                msg = "No se puede eliminar el usuario porque tiene registros asociados.";
            } else {
                msg = extraerMensajeError(err);
            }
            setError(msg);
            setIsDeleteOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    // ─── Renderizado condicional ──────────────────────────────────────

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    if (!esDirector) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <svg className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-700">Acceso Denegado</h2>
                <p className="text-gray-500">No tienes permisos para ver la gestión de usuarios.</p>
                <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
            </div>
        );
    }

    // ─── JSX principal ─────────────────────────────────────────────────

    return (
        <div className="space-y-6 animate-slideDown">
            {/* Header con contador */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        Usuarios del Sistema
                        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {usuarios.length} {usuarios.length === 1 ? "usuario" : "usuarios"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de cuentas, roles y permisos</p>
                </div>
                <Button onClick={handleOpenCreate} variant="primary">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Usuario
                </Button>
            </div>

            {/* Alertas */}
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            {/* Tabla estilizada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol(es)</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span className="font-medium">No hay usuarios registrados</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            usuarios.map((usuario) => {
                                // Obtener nombres de grupos (roles)
                                const gruposNombres = usuario.groups_detail?.map(g => g.name) || [];

                                return (
                                    <TableRow key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-medium text-gray-900">#{usuario.id}</TableCell>
                                        <TableCell className="font-semibold text-gray-800">{usuario.username}</TableCell>
                                        <TableCell className="text-gray-600">{usuario.email || "—"}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {gruposNombres.map((nombre, idx) => (
                                                    <Badge key={idx} variant="blue" className="text-xs">
                                                        {nombre}
                                                    </Badge>
                                                ))}
                                                {gruposNombres.length === 0 && (
                                                    <span className="text-gray-400 text-sm">Sin rol</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleToggleActivo(usuario)}
                                                disabled={cambiandoEstado === usuario.id || usuario.id === user?.id}
                                                title={usuario.id === user?.id ? "No puedes desactivar tu propia cuenta" : ""}
                                            >
                                                <Badge variant={usuario.is_active ? "green" : "red"} className="cursor-pointer">
                                                    {usuario.is_active ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(usuario)}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    Editar Rol
                                                </Button>
                                                <Button
                                                    variant="ghostDanger"
                                                    size="sm"
                                                    onClick={() => confirmDelete(usuario)}
                                                    className="text-red-600 hover:bg-red-50"
                                                    disabled={usuario.id === user?.id} // Evitar autoeliminación
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ─── MODAL DE EDICIÓN DE ROL ──────────────────────────── */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <button
                            onClick={handleCloseEdit}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Editar Roles de {usuarioEdit?.username}
                        </h2>

                        <form id="edit-rol-form" onSubmit={handleSubmitEdit} className="space-y-5">
                            {editError && <Alert variant="error">{editError}</Alert>}

                            <Select
                                label="Asignar Rol(es)"
                                name="groups"
                                multiple
                                value={editForm.groups}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setEditForm(prev => ({ ...prev, groups: selected }));
                                }}
                                options={roles.map(rol => ({ value: rol.id.toString(), label: rol.name }))}
                            />
                            <p className="text-xs text-gray-500 -mt-2">Puede seleccionar múltiples roles manteniendo presionada la tecla Ctrl (Windows) o Cmd (Mac).</p>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={handleCloseEdit} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" isLoading={submitting}>
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL DE CREACIÓN DE USUARIO ─────────────────────── */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <button
                            onClick={() => setIsCreateOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Usuario</h2>

                        <form onSubmit={handleSubmitCreate} className="space-y-5">
                            {createError && <Alert variant="error">{createError}</Alert>}

                            <Input
                                label="Usuario"
                                value={createForm.username}
                                onChange={(e) => setCreateForm((f) => ({ ...f, username: e.target.value }))}
                                required
                            />
                            <Input
                                label="Contraseña"
                                type="password"
                                value={createForm.password}
                                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                                required
                            />
                            <Input
                                label="Correo electrónico"
                                type="email"
                                value={createForm.email}
                                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                            />
                            <Select
                                label="Rol(es)"
                                multiple
                                value={createForm.groups}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setCreateForm((f) => ({ ...f, groups: selected }));
                                }}
                                options={roles.map(rol => ({ value: rol.id.toString(), label: rol.name }))}
                            />

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)} disabled={creating}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" isLoading={creating}>
                                    Crear Usuario
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL DE CONFIRMACIÓN PARA ELIMINAR ──────────────── */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eliminar Usuario</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro de que desea eliminar al usuario "<strong>{usuarioToDelete?.username}</strong>"?
                            Esta acción eliminará permanentemente la cuenta y todos sus datos asociados.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} disabled={deleting}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
                                Eliminar Usuario
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}