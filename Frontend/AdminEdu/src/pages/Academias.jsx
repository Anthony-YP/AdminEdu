import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";

export default function Academias() {
    const { hasGroup } = useAuth();
    const esDirector = hasGroup(["Director"]);

    const [academias, setAcademias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nombre: "",
        telefono: "",
        ciudad: "",
        calle_principal: "",
        calle_secundaria: "",
        numero_casa: "",
        referencia: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Delete modal state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [academiaToDelete, setAcademiaToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Cargar academias
    const cargarAcademias = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/academias/");
            setAcademias(response.data);
        } catch (err) {
            console.error("Error al cargar academias:", err);
            setError("No se pudieron cargar las academias. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarAcademias();
    }, []);

    // Auto-dismiss messages
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess("");
                setError("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const extraerMensajeError = (err) => {
        if (err.response?.data) {
            const data = err.response.data;
            if (typeof data === 'object' && !data.detail) {
                return Object.keys(data).map(key => {
                    const msgs = Array.isArray(data[key]) ? data[key].join(", ") : data[key];
                    return `${key}: ${msgs}`;
                }).join(" | ");
            }
            return data.detail || "Error en la operación.";
        }
        return "Ocurrió un error inesperado.";
    };

    const handleOpenForm = (academia = null) => {
        setFormError("");
        if (academia) {
            setFormData({
                id: academia.id,
                nombre: academia.nombre || "",
                telefono: academia.telefono || "",
                ciudad: academia.direccion?.ciudad || "",
                calle_principal: academia.direccion?.calle_principal || "",
                calle_secundaria: academia.direccion?.calle_secundaria || "",
                numero_casa: academia.direccion?.numero_casa || "",
                referencia: academia.direccion?.referencia || ""
            });
        } else {
            setFormData({
                id: null,
                nombre: "",
                telefono: "",
                ciudad: "",
                calle_principal: "",
                calle_secundaria: "",
                numero_casa: "",
                referencia: ""
            });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.nombre.trim()) {
            setFormError("El nombre de la academia es requerido.");
            return;
        }
        if (!formData.telefono.trim()) {
            setFormError("El teléfono es requerido.");
            return;
        }
        if (!formData.ciudad.trim()) {
            setFormError("La ciudad es requerida.");
            return;
        }
        if (!formData.calle_principal.trim()) {
            setFormError("La calle principal es requerida.");
            return;
        }
        if (!formData.calle_secundaria.trim()) {
            setFormError("La calle secundaria es requerida.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                nombre: formData.nombre.trim(),
                telefono: formData.telefono.trim(),
                ciudad: formData.ciudad.trim(),
                calle_principal: formData.calle_principal.trim(),
                calle_secundaria: formData.calle_secundaria.trim(),
                numero_casa: formData.numero_casa.trim(),
                referencia: formData.referencia.trim()
            };

            let response;
            if (formData.id) {
                response = await api.put(`/academias/${formData.id}/`, payload);
                setAcademias(academias.map(a => a.id === formData.id ? response.data : a));
                setSuccess(`Academia "${response.data.nombre}" actualizada exitosamente.`);
            } else {
                response = await api.post("/academias/", payload);
                setAcademias([...academias, response.data]);
                setSuccess(`Academia "${response.data.nombre}" creada exitosamente.`);
            }
            handleCloseForm();
        } catch (err) {
            console.error("Error al guardar academia:", err);
            setFormError(extraerMensajeError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = (academia) => {
        setAcademiaToDelete(academia);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!academiaToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/academias/${academiaToDelete.id}/`);
            setAcademias(academias.filter(a => a.id !== academiaToDelete.id));
            setSuccess(`Academia "${academiaToDelete.nombre}" eliminada exitosamente.`);
            setIsDeleteOpen(false);
            setAcademiaToDelete(null);
        } catch (err) {
            console.error("Error al eliminar academia:", err);
            let msg = "No se pudo eliminar la academia.";
            if (err.response?.status === 409 || err.response?.data?.detail?.includes("asociados")) {
                msg = "No se puede eliminar la academia porque tiene cursos o paralelos asociados.";
            } else {
                msg = extraerMensajeError(err);
            }
            setError(msg);
            setIsDeleteOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slideDown">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        Academias
                        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {academias.length} {academias.length === 1 ? 'institución' : 'instituciones'}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de sedes e instituciones académicas</p>
                </div>
                {esDirector && (
                    <Button onClick={() => handleOpenForm()} variant="primary">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Academia
                    </Button>
                )}
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ciudad</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</TableHeader>
                            {esDirector && <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</TableHeader>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {academias.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={esDirector ? 6 : 5} className="text-center text-gray-500 py-8">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-medium">No hay academias registradas</span>
                                        {esDirector && (
                                            <Button variant="link" onClick={() => handleOpenForm()} className="mt-2 text-blue-600">
                                                Crear la primera academia
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            academias.map((academia) => (
                                <TableRow key={academia.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium text-gray-900">#{academia.id}</TableCell>
                                    <TableCell className="font-semibold text-gray-800">{academia.nombre}</TableCell>
                                    <TableCell className="text-gray-600">{academia.telefono || "—"}</TableCell>
                                    <TableCell className="text-gray-600">{academia.direccion?.ciudad || "—"}</TableCell>
                                    <TableCell>
                                        <Badge variant="green" className="bg-green-100 text-green-800">Activa</Badge>
                                    </TableCell>
                                    {esDirector && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleOpenForm(academia)} className="text-blue-600 hover:bg-blue-50">
                                                    Editar
                                                </Button>
                                                <Button variant="ghostDanger" size="sm" onClick={() => confirmDelete(academia)} className="text-red-600 hover:bg-red-50">
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ===== MODAL DE FORMULARIO (personalizado) ===== */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        {/* Botón cerrar */}
                        <button
                            onClick={handleCloseForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {formData.id ? "Editar Academia" : "Nueva Academia"}
                        </h2>

                        <form id="academia-form" onSubmit={handleSubmit} className="space-y-5">
                            {formError && <Alert variant="error">{formError}</Alert>}

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Información General</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Nombre de la Institución" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Academia Central Norte" required autoFocus />
                                    <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej. 0987654321" required />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dirección</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Ej. Quito" required />
                                    <Input label="Número de Casa" name="numero_casa" value={formData.numero_casa} onChange={handleChange} placeholder="Ej. S/N" />
                                    <Input label="Calle Principal" name="calle_principal" value={formData.calle_principal} onChange={handleChange} placeholder="Ej. Av. 10 de Agosto" required />
                                    <Input label="Calle Secundaria" name="calle_secundaria" value={formData.calle_secundaria} onChange={handleChange} placeholder="Ej. Colón" required />
                                </div>
                                <div className="mt-4">
                                    <Input label="Referencia" name="referencia" value={formData.referencia} onChange={handleChange} placeholder="Ej. Frente al parque central" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={submitting}>Cancelar</Button>
                                <Button type="submit" variant="primary" isLoading={submitting}>
                                    {formData.id ? "Guardar Cambios" : "Crear Academia"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== MODAL DE CONFIRMACIÓN PARA ELIMINAR (personalizado) ===== */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eliminar Academia</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro de que desea eliminar la academia "<strong>{academiaToDelete?.nombre}</strong>"?
                            Esta acción eliminará permanentemente la academia y todos sus datos asociados, incluyendo cursos y paralelos vinculados.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} disabled={deleting}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
                                Eliminar Academia
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}