import {
    useEffect,
    useState
} from "react";

import api from "../api/api";


export default function CursosList() {

    const [
        cursos,
        setCursos
    ] = useState([]);


    const loadCursos = async () => {

        try {

            const response = await api.get(
                "/curso/"
            );

            setCursos(
                response.data
            );

        } catch (error) {

            console.error(
                "Error al cargar los cursos:",
                error
            );

        }

    };


    useEffect(() => {

        loadCursos();

    }, []);


    return (

        <div
            className="
                mt-8
                max-w-7xl
                mx-auto
                px-4
            "
        >

            <h1
                className="
                    text-3xl
                    font-bold
                    text-sky-900
                "
            >

                Cursos Disponibles

            </h1>


            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    mt-5
                    gap-5
                "
            >

                {
                    cursos.map(
                        curso => (

                            <div
                                key={
                                    curso.id
                                }

                                className="
                                    bg-sky-900
                                    p-4
                                    rounded-lg
                                    shadow
                                    text-white
                                "
                            >

                                <p>
                                    {
                                        curso.nombre
                                    }
                                </p>


                                <p>

                                    <span
                                        className="
                                            font-bold
                                        "
                                    >

                                        Precio:

                                    </span>

                                    $

                                    {
                                        curso.precio
                                    }

                                </p>


                                <div
                                    className="
                                        mt-5
                                    "
                                >

                                    <button
                                        className="
                                            bg-green-400
                                            p-4
                                            rounded-lg
                                        "
                                    >

                                        Editar

                                    </button>


                                    <button
                                        className="
                                            bg-red-400
                                            p-4
                                            rounded-lg
                                            ml-5
                                        "
                                    >

                                        Eliminar

                                    </button>

                                </div>

                            </div>

                        )
                    )

                }

            </div>

        </div>

    );

}