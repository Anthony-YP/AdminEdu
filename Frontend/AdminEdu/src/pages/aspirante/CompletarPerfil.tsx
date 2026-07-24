import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AspiranteService from "../../services/AspiranteService";

function calcularEdad(fechaNacimiento: string): number | null {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    if (Number.isNaN(nacimiento.getTime())) return null;
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
}

const inputClass =
    "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function CompletarPerfil() {
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        tipo_documento: "CEDULA",
        numero_identificacion: "",
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "",
        fecha_nacimiento: "",
    });

    const [direccion, setDireccion] = useState({
        ciudad: "",
        calle_principal: "",
        calle_secundaria: "",
        numero_casa: "",
        referencia: "",
    });

    const [representante, setRepresentante] = useState({
        tipo_documento: "CEDULA",
        numero_identificacion: "",
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "",
        fecha_nacimiento: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const edad = calcularEdad(datos.fecha_nacimiento);
    const esMenorDeEdad = edad !== null && edad < 18;

    const handleDatoChange = (campo: string, valor: string) => {
        setDatos((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleDireccionChange = (campo: string, valor: string) => {
        setDireccion((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleRepresentanteChange = (campo: string, valor: string) => {
        setRepresentante((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!datos.numero_identificacion || !datos.nombres || !datos.apellidos || !datos.correo || !datos.telefono || !datos.fecha_nacimiento) {
            setError("Complete todos los datos personales.");
            return;
        }
        if (!direccion.ciudad || !direccion.calle_principal || !direccion.calle_secundaria) {
            setError("Complete los datos de dirección.");
            return;
        }
        if (esMenorDeEdad) {
            if (!representante.numero_identificacion || !representante.nombres || !representante.apellidos || !representante.correo || !representante.telefono || !representante.fecha_nacimiento) {
                setError("Por ser menor de edad, debe completar los datos del representante legal.");
                return;
            }
        }

        try {
            setLoading(true);
            await AspiranteService.completarPerfil({
                ...datos,
                direccion,
                representante_legal: esMenorDeEdad ? representante : undefined,
            });
            navigate("/aspirante", { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.detail || "No se pudo guardar el perfil. Verifique los datos ingresados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Completa tu perfil</h1>
                <p className="text-slate-500 mt-1">
                    Necesitamos estos datos reales antes de que puedas solicitar una matrícula.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-semibold text-slate-800">Datos personales</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Tipo de documento</label>
                            <select
                                className={inputClass}
                                value={datos.tipo_documento}
                                onChange={(e) => handleDatoChange("tipo_documento", e.target.value)}
                            >
                                <option value="CEDULA">Cédula</option>
                                <option value="PASAPORTE">Pasaporte</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Número de identificación</label>
                            <input className={inputClass} value={datos.numero_identificacion} onChange={(e) => handleDatoChange("numero_identificacion", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Nombres</label>
                            <input className={inputClass} value={datos.nombres} onChange={(e) => handleDatoChange("nombres", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Apellidos</label>
                            <input className={inputClass} value={datos.apellidos} onChange={(e) => handleDatoChange("apellidos", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Correo electrónico</label>
                            <input type="email" className={inputClass} value={datos.correo} onChange={(e) => handleDatoChange("correo", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Teléfono</label>
                            <input className={inputClass} value={datos.telefono} onChange={(e) => handleDatoChange("telefono", e.target.value)} placeholder="10 dígitos" />
                        </div>
                        <div>
                            <label className={labelClass}>Fecha de nacimiento</label>
                            <input type="date" className={inputClass} value={datos.fecha_nacimiento} onChange={(e) => handleDatoChange("fecha_nacimiento", e.target.value)} />
                            {edad !== null && (
                                <p className="text-xs text-slate-400 mt-1">Edad calculada: {edad} años</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-semibold text-slate-800">Dirección</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Ciudad</label>
                            <input className={inputClass} value={direccion.ciudad} onChange={(e) => handleDireccionChange("ciudad", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Calle principal</label>
                            <input className={inputClass} value={direccion.calle_principal} onChange={(e) => handleDireccionChange("calle_principal", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Calle secundaria</label>
                            <input className={inputClass} value={direccion.calle_secundaria} onChange={(e) => handleDireccionChange("calle_secundaria", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Número de casa</label>
                            <input className={inputClass} value={direccion.numero_casa} onChange={(e) => handleDireccionChange("numero_casa", e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Referencia</label>
                            <input className={inputClass} value={direccion.referencia} onChange={(e) => handleDireccionChange("referencia", e.target.value)} />
                        </div>
                    </div>
                </div>

                {esMenorDeEdad && (
                    <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 space-y-4">
                        <h2 className="font-semibold text-amber-800">
                            Representante legal <span className="font-normal text-amber-600">(requerido por ser menor de edad)</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Tipo de documento</label>
                                <select className={inputClass} value={representante.tipo_documento} onChange={(e) => handleRepresentanteChange("tipo_documento", e.target.value)}>
                                    <option value="CEDULA">Cédula</option>
                                    <option value="PASAPORTE">Pasaporte</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Número de identificación</label>
                                <input className={inputClass} value={representante.numero_identificacion} onChange={(e) => handleRepresentanteChange("numero_identificacion", e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Nombres</label>
                                <input className={inputClass} value={representante.nombres} onChange={(e) => handleRepresentanteChange("nombres", e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Apellidos</label>
                                <input className={inputClass} value={representante.apellidos} onChange={(e) => handleRepresentanteChange("apellidos", e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Correo electrónico</label>
                                <input type="email" className={inputClass} value={representante.correo} onChange={(e) => handleRepresentanteChange("correo", e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Teléfono</label>
                                <input className={inputClass} value={representante.telefono} onChange={(e) => handleRepresentanteChange("telefono", e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Fecha de nacimiento</label>
                                <input type="date" className={inputClass} value={representante.fecha_nacimiento} onChange={(e) => handleRepresentanteChange("fecha_nacimiento", e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                        loading ? "bg-emerald-500/50 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                >
                    {loading ? "Guardando..." : "Guardar perfil"}
                </button>
            </form>
        </div>
    );
}
