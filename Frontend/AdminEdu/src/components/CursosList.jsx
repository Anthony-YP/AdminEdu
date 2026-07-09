import {useEffect, useState} from "react";
import { getCursos } from "../api/cursos.js";

export default function CursosList() {

    const [cursos, setCursos] = useState([])

    const loadCursos = async () => {
        const response = await getCursos()
        setCursos(response.data)
    }
    useEffect(() => {
        loadCursos()
    }, [])
    return (
        <div className="mt-8">
            <h1 className="text-3xl font-bold text-sky-900"> Cursos Disponibles</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-5 text-white">
                {cursos.map(curso => (
                    <div key={curso.id} className="bg-sky-900 p-4 rounded-lg shadow">
                        <p>{curso.nombre}</p>
                        <p><span className="font-bold">Precio: </span>${curso.precio}</p>
                        <div className="mt-5">
                            <button className="bg-green-400 p-4 rounded-lg">Editar</button>
                            <button className="bg-red-400 p-4 rounded-lg ml-5">Eliminar</button>
                        </div>
                    </div>

                ))}
            </div>

        </div>
    );
}