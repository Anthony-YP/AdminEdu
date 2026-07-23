import { useAuth } from "../../hooks/useAuth";

export default function Perfil() {
    const { usuario } = useAuth();

    const initials = usuario
        ? (usuario.first_name?.charAt(0) || usuario.username?.charAt(0) || "A").toUpperCase()
        : "A";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>
                <p className="text-slate-500 mt-1">Información de tu cuenta</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl">
                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
                    {usuario?.photo ? (
                        <img
                            src={usuario.photo}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full object-cover border-3 border-emerald-200 shadow-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-3xl font-bold text-emerald-700">{initials}</span>
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {usuario?.first_name && usuario?.last_name
                                ? `${usuario.first_name} ${usuario.last_name}`
                                : usuario?.username}
                        </h2>
                        <p className="text-slate-500 text-sm mt-0.5">@{usuario?.username}</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mt-2">
                            Aspirante
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Nombre:</span>
                        <span className="text-sm text-slate-700 font-medium">
                            {usuario?.first_name || "No registrado"}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Apellido:</span>
                        <span className="text-sm text-slate-700 font-medium">
                            {usuario?.last_name || "No registrado"}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Email:</span>
                        <span className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">
                            {usuario?.email}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Usuario:</span>
                        <span className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">
                            {usuario?.username}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-slate-400 font-medium w-32">Rol:</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Aspirante
                        </span>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-400">
                        Tu cuenta fue creada mediante Google OAuth. Para actualizar tu información,
                        contacta a la administración del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
}
