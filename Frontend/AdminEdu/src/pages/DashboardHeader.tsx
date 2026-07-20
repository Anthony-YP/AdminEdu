interface DashboardHeaderProps {
    role: string;
    username: string;
}

export const DashboardHeader = ({ role, username }: DashboardHeaderProps) => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots" />
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
                ¡Bienvenido, {username}!
            </h1>
            <p className="text-blue-100 max-w-xl">
                Panel de {role}. Desde aquí accedes a todas las herramientas de gestión.
            </p>
        </div>
    </div>
);