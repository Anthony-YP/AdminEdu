import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Mail, Phone, IdCard, Calendar, Pencil, X } from "lucide-react";

const TIPO_DOCUMENTO_LABEL = { CEDULA: "Cédula", PASAPORTE: "Pasaporte" };

function formatearFecha(fecha) {
    if (!fecha) return "—";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

export default function EstudiantePerfil() {
    const { usuario } = useAuth();

    const [persona, setPersona] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ correo: "", telefono: "" });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const { data } = await api.get("/personas/");
                setPersona(data?.[0] || null);
            } catch {
                setError("No se pudo cargar tu perfil.");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => setSuccess(""), 4000);
            return () => clearTimeout(t);
        }
    }, [success]);

    const handleOpenEdit = () => {
        setFormData({ correo: persona?.correo || "", telefono: persona?.telefono || "" });
        setFormError("");
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.correo.trim() || !formData.telefono.trim()) {
            setFormError("El correo y el teléfono no pueden quedar vacíos.");
            return;
        }

        try {
            setSaving(true);
            const { data } = await api.patch(`/personas/${persona.id}/`, formData);
            // PersonaCreateSerializer no incluye "id" en su respuesta, así
            // que se fusiona sobre el registro actual en vez de reemplazarlo.
            setPersona((prev) => ({ ...prev, ...data }));
            setIsEditing(false);
            setSuccess("Perfil actualizado correctamente.");
        } catch (err) {
            const detail = err.response?.data;
            const msg = typeof detail === "object" && detail
                ? Object.values(detail).flat().join(" ")
                : "No se pudo actualizar el perfil.";
            setFormError(msg);
        } finally {
            setSaving(false);
        }
    };

    const getInitials = () => {
        if (persona?.nombres) return persona.nombres.charAt(0).toUpperCase();
        if (usuario?.username) return usuario.username.charAt(0).toUpperCase();
        return "U";
    };

    const nombreCompleto = persona ? `${persona.nombres} ${persona.apellidos}` : usuario?.username;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-sm text-gray-500">Revisa y actualiza tus datos personales.</p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Encabezado con avatar, nombre y rol */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 shadow-xl">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative p-8 flex flex-col sm:flex-row sm:items-center gap-5">
                    {usuario?.photo ? (
                        <img
                            src={usuario.photo}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg flex-shrink-0"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg ring-2 ring-white/30 flex-shrink-0">
                            {getInitials()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-white truncate">{nombreCompleto}</h2>
                        <p className="text-blue-100 text-sm">@{usuario?.username}</p>
                        <Badge variant="outline" className="border-white/30 text-white bg-white/10 px-3 py-1 mt-2 inline-block">
                            Estudiante
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Información personal */}
            {!persona ? (
                <Alert variant="info">
                    Aún no tienes un perfil asociado. Solicita que se te registre la información personal para completar esta sección.
                </Alert>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Información personal</h3>
                        {!isEditing && (
                            <Button variant="secondary" size="sm" onClick={handleOpenEdit}>
                                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                Editar perfil
                            </Button>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Nombres</p>
                                <p className="text-sm font-semibold text-gray-900">{persona.nombres}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Apellidos</p>
                                <p className="text-sm font-semibold text-gray-900">{persona.apellidos}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <IdCard className="w-3.5 h-3.5" /> Documento
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {persona.numero_identificacion}
                                    <span className="text-gray-400 font-normal ml-1">
                                        ({TIPO_DOCUMENTO_LABEL[persona.tipo_documento] || persona.tipo_documento})
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Fecha de nacimiento
                                </p>
                                <p className="text-sm font-semibold text-gray-900">{formatearFecha(persona.fecha_nacimiento)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5" /> Correo
                                </p>
                                <p className="text-sm font-semibold text-gray-900">{persona.correo}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5" /> Teléfono
                                </p>
                                <p className="text-sm font-semibold text-gray-900">{persona.telefono}</p>
                            </div>
                            <p className="sm:col-span-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
                                Nombres, documento y fecha de nacimiento son gestionados por la administración. Puedes actualizar tu correo y teléfono con el botón "Editar perfil".
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && <Alert variant="error">{formError}</Alert>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={(e) => setFormData((f) => ({ ...f, correo: e.target.value }))}
                                    required
                                />
                                <Input
                                    label="Teléfono"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData((f) => ({ ...f, telefono: e.target.value }))}
                                    required
                                />
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
            )}
        </div>
    );
}
