import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

const navItems = [
    { path: "/aspirante", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", exact: true },
    { path: "/aspirante/cursos", label: "Cursos Disponibles", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", exact: false },
    { path: "/aspirante/solicitudes", label: "Mis Solicitudes", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", exact: false },
    { path: "/aspirante/segumiento", label: "Seguimiento", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", exact: false },
    { path: "/aspirante/documentos", label: "Documentos", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z", exact: false },
    { path: "/aspirante/pagos", label: "Pagos", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", exact: false },
    { path: "/aspirante/notificaciones", label: "Notificaciones", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", exact: false },
    { path: "/aspirante/perfil", label: "Mi Perfil", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", exact: false },
];

export default function AspiranteLayout() {
    const { usuario, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path: string, exact: boolean) =>
        exact ? location.pathname === path : location.pathname.startsWith(path);

    const userInitials = usuario
        ? ((usuario.first_name?.[0] || "") + (usuario.last_name?.[0] || "") || usuario.username?.[0] || "A").toUpperCase()
        : "A";

    const currentLabel = navItems.find(item => isActive(item.path, item.exact))?.label || "Portal Aspirante";

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* ===== Desktop Sidebar ===== */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 flex-shrink-0">
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
                    <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-lg font-bold text-white tracking-tight">AdminEdu</span>
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Portal Aspirante</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
                    {navItems.map((item) => {
                        const active = isActive(item.path, item.exact);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                    active
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                }`}
                            >
                                <svg
                                    className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div className="p-3 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-2">
                        {usuario?.photo ? (
                            <img
                                src={usuario.photo}
                                alt="Foto de perfil"
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30 flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {userInitials}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {usuario?.first_name && usuario?.last_name
                                    ? `${usuario.first_name} ${usuario.last_name}`
                                    : usuario?.username || "Aspirante"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{usuario?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* ===== Mobile sidebar overlay ===== */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ===== Mobile sidebar drawer ===== */}
            <div
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <aside className="flex flex-col h-full bg-slate-900 shadow-2xl">
                    {/* Brand */}
                    <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white tracking-tight">AdminEdu</span>
                                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Portal Aspirante</p>
                            </div>
                        </div>
                        <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
                        {navItems.map((item) => {
                            const active = isActive(item.path, item.exact);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        active
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                    }`}
                                >
                                    <svg className={`w-5 h-5 flex-shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User footer */}
                    <div className="p-3 border-t border-slate-800">
                        <div className="flex items-center gap-3 px-2 py-2">
                            {usuario?.photo ? (
                                <img src={usuario.photo} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30 flex-shrink-0" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{userInitials}</div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{usuario?.first_name && usuario?.last_name ? `${usuario.first_name} ${usuario.last_name}` : usuario?.username || "Aspirante"}</p>
                                <p className="text-xs text-slate-500 truncate">{usuario?.email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </aside>
            </div>

            {/* ===== Right side: topbar + content ===== */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile topbar */}
                <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-slate-200 flex-shrink-0">
                    <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="text-sm font-semibold text-slate-800">{currentLabel}</span>
                    <div className="w-8" />
                </header>

                {/* Desktop topbar */}
                <header className="hidden lg:flex items-center justify-between px-8 h-16 bg-white border-b border-slate-200 flex-shrink-0">
                    <h1 className="text-xl font-bold text-slate-800">{currentLabel}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-700">
                                {usuario?.first_name && usuario?.last_name
                                    ? `${usuario.first_name} ${usuario.last_name}`
                                    : usuario?.username || "Aspirante"}
                            </p>
                            <p className="text-xs text-slate-400">{usuario?.email}</p>
                        </div>
                        {usuario?.photo ? (
                            <img
                                src={usuario.photo}
                                alt="Foto de perfil"
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                                {userInitials}
                            </div>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
