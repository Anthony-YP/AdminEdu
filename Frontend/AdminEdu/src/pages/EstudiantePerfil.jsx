import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import AspiranteService from "../services/AspiranteService";
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

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    if (Number.isNaN(nacimiento.getTime())) return null;
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
}

const DATOS_INICIALES = {
    tipo_documento: "CEDULA",
    numero_identificacion: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
};

const DIRECCION_INICIAL = {
    ciudad: "",
    calle_principal: "",
    calle_secundaria: "",
    numero_casa: "",
    referencia: "",
};

const REPRESENTANTE_INICIAL = {
    tipo_documento: "CEDULA",
    numero_identificacion: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
};

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

    // Completar perfil (usuarios que entraron con Google y aún no tienen
    // datos personales registrados)
    const [completando, setCompletando] = useState(false);
    const [datosPerfil, setDatosPerfil] = useState(DATOS_INICIALES);
    const [direccionPerfil, setDireccionPerfil] = useState(DIRECCION_INICIAL);
    const [representantePerfil, setRepresentantePerfil] = useState(REPRESENTANTE_INICIAL);
    const [completarError, setCompletarError] = useState("");
    const [completarLoading, setCompletarLoading] = useState(false);

    const edadPerfil = calcularEdad(datosPerfil.fecha_nacimiento);
    const esMenorDeEdadPerfil = edadPerfil !== null && edadPerfil < 18;

    const cargarPersona = async () => {
        const { data } = await api.get("/personas/");
        setPersona(data?.[0] || null);
    };

    useEffect(() => {
        const cargar = async () => {
            try {
                await cargarPersona();
            } catch {
                setError("No se pudo cargar tu perfil.");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const handleOpenCompletar = () => {
        setDatosPerfil({ ...DATOS_INICIALES, correo: usuario?.email || "" });
        setDireccionPerfil(DIRECCION_INICIAL);
        setRepresentantePerfil(REPRESENTANTE_INICIAL);
        setCompletarError("");
        setCompletando(true);
    };

    const handleCompletarSubmit = async (e) => {
        e.preventDefault();
        setCompletarError("");

        if (!datosPerfil.numero_identificacion || !datosPerfil.nombres || !datosPerfil.apellidos || !datosPerfil.correo || !datosPerfil.telefono || !datosPerfil.fecha_nacimiento) {
            setCompletarError("Complete todos los datos personales.");
            return;
        }
        if (!direccionPerfil.ciudad || !direccionPerfil.calle_principal || !direccionPerfil.calle_secundaria) {
            setCompletarError("Complete los datos de dirección.");
            return;
        }
        if (esMenorDeEdadPerfil) {
            if (!representantePerfil.numero_identificacion || !representantePerfil.nombres || !representantePerfil.apellidos || !representantePerfil.correo || !representantePerfil.telefono || !representantePerfil.fecha_nacimiento) {
                setCompletarError("Por ser menor de edad, debe completar los datos del representante legal.");
                return;
            }
        }

        try {
            setCompletarLoading(true);
            await AspiranteService.completarPerfil({
                ...datosPerfil,
                direccion: direccionPerfil,
                representante_legal: esMenorDeEdadPerfil ? representantePerfil : undefined,
            });
            await cargarPersona();
            setCompletando(false);
            setSuccess("Perfil completado correctamente.");
        } catch (err) {
            setCompletarError(err.response?.data?.detail || "No se pudo guardar el perfil. Verifique los datos ingresados.");
        } finally {
            setCompletarLoading(false);
        }
    };

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
                completando ? (
                    <form onSubmit={handleCompletarSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                        {completarError && <Alert variant="error">{completarError}</Alert>}

                        <div className="space-y-4">
                            <h3 className="text-base font-semibold text-gray-900">Datos personales</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de documento</label>
                                    <select
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={datosPerfil.tipo_documento}
                                        onChange={(e) => setDatosPerfil((d) => ({ ...d, tipo_documento: e.target.value }))}
                                    >
                                        <option value="CEDULA">Cédula</option>
                                        <option value="PASAPORTE">Pasaporte</option>
                                    </select>
                                </div>
                                <Input label="Número de identificación" value={datosPerfil.numero_identificacion} onChange={(e) => setDatosPerfil((d) => ({ ...d, numero_identificacion: e.target.value }))} required />
                                <Input label="Nombres" value={datosPerfil.nombres} onChange={(e) => setDatosPerfil((d) => ({ ...d, nombres: e.target.value }))} required />
                                <Input label="Apellidos" value={datosPerfil.apellidos} onChange={(e) => setDatosPerfil((d) => ({ ...d, apellidos: e.target.value }))} required />
                                <Input label="Correo" type="email" value={datosPerfil.correo} onChange={(e) => setDatosPerfil((d) => ({ ...d, correo: e.target.value }))} required />
                                <Input label="Teléfono" value={datosPerfil.telefono} onChange={(e) => setDatosPerfil((d) => ({ ...d, telefono: e.target.value }))} placeholder="10 dígitos" required />
                                <div>
                                    <Input label="Fecha de nacimiento" type="date" value={datosPerfil.fecha_nacimiento} onChange={(e) => setDatosPerfil((d) => ({ ...d, fecha_nacimiento: e.target.value }))} required />
                                    {edadPerfil !== null && <p className="text-xs text-gray-400 mt-1">Edad calculada: {edadPerfil} años</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <h3 className="text-base font-semibold text-gray-900">Dirección</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Ciudad" value={direccionPerfil.ciudad} onChange={(e) => setDireccionPerfil((d) => ({ ...d, ciudad: e.target.value }))} required />
                                <Input label="Calle principal" value={direccionPerfil.calle_principal} onChange={(e) => setDireccionPerfil((d) => ({ ...d, calle_principal: e.target.value }))} required />
                                <Input label="Calle secundaria" value={direccionPerfil.calle_secundaria} onChange={(e) => setDireccionPerfil((d) => ({ ...d, calle_secundaria: e.target.value }))} required />
                                <Input label="Número de casa" value={direccionPerfil.numero_casa} onChange={(e) => setDireccionPerfil((d) => ({ ...d, numero_casa: e.target.value }))} />
                                <div className="sm:col-span-2">
                                    <Input label="Referencia" value={direccionPerfil.referencia} onChange={(e) => setDireccionPerfil((d) => ({ ...d, referencia: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        {esMenorDeEdadPerfil && (
                            <div className="space-y-4 border-t border-amber-200 bg-amber-50 rounded-xl p-4">
                                <h3 className="text-base font-semibold text-amber-800">
                                    Representante legal <span className="font-normal text-amber-600">(requerido por ser menor de edad)</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de documento</label>
                                        <select
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={representantePerfil.tipo_documento}
                                            onChange={(e) => setRepresentantePerfil((r) => ({ ...r, tipo_documento: e.target.value }))}
                                        >
                                            <option value="CEDULA">Cédula</option>
                                            <option value="PASAPORTE">Pasaporte</option>
                                        </select>
                                    </div>
                                    <Input label="Número de identificación" value={representantePerfil.numero_identificacion} onChange={(e) => setRepresentantePerfil((r) => ({ ...r, numero_identificacion: e.target.value }))} required />
                                    <Input label="Nombres" value={representantePerfil.nombres} onChange={(e) => setRepresentantePerfil((r) => ({ ...r, nombres: e.target.value }))} required />
                                    <Input label="Apellidos" value={representantePerfil.apellidos} onChange={(e) => setRepresentantePerfil((r) => ({ ...r, apellidos: e.target.value }))} required />
                                    <Input label="Correo" type="email" value={representantePerfil.correo} onChange={(e) => setRepresentantePerfil((r) => ({ ...r, correo: e.target.value }))} required />
                                    <Input label="Teléfono" value={representantePerfil.telefono} onChange={(e) => setRepresentantePerfil((r) => ({ ...r, telefono: e.target.value }))} required />
                                    <Input label="Fecha de nacimiento" type="date" value={representantePerfil.fecha_nacimiento} onChange={(e) => setRepresentantePerfil((r) => ({ ...r, fecha_nacimiento: e.target.value }))} required />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Button type="button" variant="secondary" onClick={() => setCompletando(false)} disabled={completarLoading}>
                                <X className="w-4 h-4 mr-1.5" />
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" isLoading={completarLoading}>
                                Guardar perfil
                            </Button>
                        </div>
                    </form>
                ) : (
                    <Alert variant="info">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span>Aún no tienes un perfil asociado. Completa tus datos personales para habilitar esta sección.</span>
                            <Button variant="primary" size="sm" onClick={handleOpenCompletar} className="shrink-0">
                                Completar perfil
                            </Button>
                        </div>
                    </Alert>
                )
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
