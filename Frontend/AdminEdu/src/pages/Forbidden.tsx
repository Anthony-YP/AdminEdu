import { useAuth } from "../hooks/useAuth";

export default function Forbidden() {

    const { logout, isAuthenticated } = useAuth();

    // Un usuario autenticado pero sin ningún rol asignado (o cuyo rol no
    // tiene módulos habilitados) queda atrapado aquí: PublicRoute redirige
    // cualquier ruta pública ("/", "/login") de vuelta a la app mientras
    // haya sesión activa, y esa ruta por defecto vuelve a caer en 403. La
    // única salida real es cerrar sesión para que isAuthenticated pase a
    // false y PublicRoute deje de interceptar "/login".
    const handleVolver = async () => {
        if (isAuthenticated) {
            await logout();
        }
        window.location.href = "/login";
    };

    return (

        <div className="min-h-screen flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold text-red-600">
                ¡Accesso Denegado!

            </h1>

            <p className="mt-4 text-gray-600 text-center max-w-sm px-4">

                No tienes permisos para acceder a esta página.
                {isAuthenticated && " Si crees que es un error, contacta al administrador del sistema. También puedes cerrar sesión e intentar con otra cuenta que cuente con los permisos necesarios."}

            </p>

            <button

                onClick={handleVolver}

                className="mt-6 text-blue-600 hover:underline"

            >

                {isAuthenticated ? "Cerrar sesión y volver al login" : "Volver al inicio"}

            </button>

        </div>

    );

}