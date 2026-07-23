import { Link } from "react-router-dom";

export default function Forbidden() {

    return (

        <div className="min-h-screen flex flex-col items-center justify-center">

            <h1 className="text-4xl font-bold">

                403

            </h1>

            <p className="mt-4 text-gray-600">

                No tienes permisos para acceder a esta página.

            </p>

            <Link

                to="/"

                className="mt-6 text-blue-600 hover:underline"

            >

                Volver al inicio

            </Link>

        </div>

    );

}