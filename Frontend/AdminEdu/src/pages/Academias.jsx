import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Building2, Phone, MapPin, BookOpen, Pencil, X } from "lucide-react";

const FORM_VACIO = {
    nombre: "",
    telefono: "",
    ciudad: "",
    calle_principal: "",
    calle_secundaria: "",
    numero_casa: "",
    referencia: "",
};

export default function Academias() {
    const { hasGroup } = useAuth();
    const navigate = useNavigate();
    const esDirector = hasGroup(["Director"]);

    const [academia, setAcademia] = useState(null);
    const [totalCursos, setTotalCursos] = useState(0);
    const [cursosActivos, setCursosActivos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(FORM_VACIO);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const cargar = async () => {
        try {
            setLoading(true);
            setError("");
            const [resAcademias, resCursos] = await Promise.all([
                api.get("/academias/"),
                api.get("/cursos/"),
            ]);
            const primera = resAcademias.data?.[0] || null;
            setAcademia(primera);

            const cursosAcademia = primera
                ? resCursos.data.filter((c) => c.academia === primera.id)
                : [];
            setTotalCursos(cursosAcademia.length);
            setCursosActivos(cursosAcademia.filter((c) => c.estado === "ACTIVO").length);
        } catch (err) {
            console.error("Error al cargar la academia:", err);
            setError("No se pudo cargar la información de la academia.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

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
            if (typeof data === "object" && !data.detail) {
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

    const handleOpenEdit = () => {
        setFormData({
            nombre: academia?.nombre || "",
            telefono: academia?.telefono || "",
            ciudad: academia?.direccion?.ciudad || "",
            calle_principal: academia?.direccion?.calle_principal || "",
            calle_secundaria: academia?.direccion?.calle_secundaria || "",
            numero_casa: academia?.direccion?.numero_casa || "",
            referencia: academia?.direccion?.referencia || "",
        });
        setFormError("");
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            setSaving(true);
            const payload = {
                nombre: formData.nombre.trim(),
                telefono: formData.telefono.trim(),
                ciudad: formData.ciudad.trim(),
                calle_principal: formData.calle_principal.trim(),
                calle_secundaria: formData.calle_secundaria.trim(),
                numero_casa: formData.numero_casa.trim(),
                referencia: formData.referencia.trim(),
            };

            const response = academia
                ? await api.put(`/academias/${academia.id}/`, payload)
                : await api.post("/academias/", payload);

            setAcademia(response.data);
            setIsEditing(false);
            setSuccess(academia ? "Información de la academia actualizada correctamente." : "Academia registrada correctamente.");
        } catch (err) {
            console.error("Error al guardar la academia:", err);
            setFormError(extraerMensajeError(err));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Academia</h1>
                <p className="text-sm text-gray-500">Información general de la institución.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            {!academia && !isEditing ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 flex flex-col items-center text-gray-500">
                    <Building2 className="w-12 h-12 text-gray-300 mb-2" />
                    <span className="font-medium">No hay información de la academia registrada.</span>
                    {esDirector && (
                        <Button variant="primary" onClick={handleOpenEdit} className="mt-4">
                            Registrar Academia
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {/* Encabezado */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 shadow-xl">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="relative p-8 flex flex-col sm:flex-row sm:items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold text-white truncate">{academia?.nombre}</h2>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-blue-100">
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" /> {academia?.telefono || "—"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" /> {academia?.direccion?.ciudad || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cursos ofertados */}
                    <button
                        type="button"
                        onClick={() => navigate("/cursos")}
                        className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-300 transition-all text-left"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-gray-800">{totalCursos}</p>
                            <p className="text-sm text-gray-500">
                                {totalCursos === 1 ? "Curso ofertado" : "Cursos ofertados"}
                                {totalCursos > 0 && ` · ${cursosActivos} activo${cursosActivos === 1 ? "" : "s"}`}
                            </p>
                        </div>
                        <span className="text-xs font-medium text-blue-600">Ver cursos →</span>
                    </button>

                    {/* Información / edición */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-gray-900">Datos de la academia</h3>
                            {esDirector && !isEditing && (
                                <Button variant="secondary" size="sm" onClick={handleOpenEdit}>
                                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                    Editar información
                                </Button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Nombre</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Teléfono</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.telefono || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Ciudad</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.direccion?.ciudad || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Número de casa</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.direccion?.numero_casa || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Calle principal</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.direccion?.calle_principal || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Calle secundaria</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.direccion?.calle_secundaria || "—"}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Referencia</p>
                                    <p className="text-sm font-semibold text-gray-900">{academia?.direccion?.referencia || "—"}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                                        <X className="w-4 h-4 mr-1.5" />
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="primary" isLoading={saving}>
                                        Guardar cambios
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
