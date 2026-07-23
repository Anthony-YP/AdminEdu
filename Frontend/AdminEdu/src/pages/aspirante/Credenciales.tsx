import { useAuth } from "../../hooks/useAuth";

export default function Credenciales() {
    const { usuario } = useAuth();

    const initials = usuario
        ? (usuario.first_name?.charAt(0) || usuario.username?.charAt(0) || "A").toUpperCase()
        : "A";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mis Credenciales</h1>
                <p className="text-slate-500 mt-1">Información de tu cuenta de acceso</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    {usuario?.photo ? (
                        <img
                            src={usuario.photo}
                            alt="Foto de perfil"
                            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-emerald-700">{initials}</span>
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {usuario?.first_name && usuario?.last_name
                                ? `${usuario.first_name} ${usuario.last_name}`
                                : usuario?.username}
                        </h2>
                        <p className="text-slate-500 text-sm">@{usuario?.username}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Usuario:</span>
                        <span className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">
                            {usuario?.username}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Email:</span>
                        <span className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">
                            {usuario?.email}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Rol:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Aspirante
                        </span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-400">
                        Tu cuenta fue creada mediante Google OAuth. Las credenciales institucionales
                        serán generadas una vez que tu matrícula sea aprobada por Secretaría.
                    </p>
                </div>
            </div>
        </div>
    );
}
