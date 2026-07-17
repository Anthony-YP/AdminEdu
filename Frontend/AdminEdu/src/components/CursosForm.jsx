import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../api/api";


export default function CursosForm() {

    const navigate = useNavigate();


    const [
        academias,
        setAcademias
    ] = useState([]);


    const [
        formData,
        setFormData
    ] = useState({

        academia: "",

        nombre: "",

        precio: "",

        fecha_inicio: "",

        fecha_fin: ""

    });


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        cargarAcademias();

    }, []);


    const cargarAcademias = async () => {

        try {

            const response =
                await api.get(
                    "/academia/"
                );


            setAcademias(
                response.data
            );


        } catch (error) {

            console.error(
                "Error al cargar academias:",
                error
            );


            setError(
                "No se pudieron cargar las academias."
            );


        } finally {

            setLoading(false);

        }

    };


    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            previousData => ({

                ...previousData,

                [name]: value

            })
        );

    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");


        if (
            formData.fecha_inicio
            >=
            formData.fecha_fin
        ) {

            setError(
                "La fecha de finalización debe ser posterior a la fecha de inicio."
            );


            return;

        }


        try {

            setSubmitting(true);


            await api.post(
                "/curso/",
                {

                    academia:
                        Number(
                            formData.academia
                        ),

                    nombre:
                        formData.nombre,

                    precio:
                        formData.precio,

                    fecha_inicio:
                        formData.fecha_inicio,

                    fecha_fin:
                        formData.fecha_fin

                }
            );


            navigate(
                "/cursos"
            );


        } catch (error) {

            console.error(
                "Error al crear el curso:",
                error
            );


            if (
                error.response?.data
            ) {

                setError(
                    JSON.stringify(
                        error.response.data
                    )
                );

            } else {

                setError(
                    "No se pudo crear el curso."
                );

            }


        } finally {

            setSubmitting(false);

        }

    };


    if (loading) {

        return (

            <div
                className="
                    flex
                    justify-center
                    items-center
                    h-64
                "
            >

                Cargando academias...

            </div>

        );

    }


    return (

        <div
            className="
                max-w-2xl
                mx-auto
                px-4
                py-8
            "
        >

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow
                    p-6
                "
            >

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-gray-800
                        mb-6
                    "
                >

                    Crear Curso

                </h1>


                {
                    error && (

                        <div
                            className="
                                bg-red-100
                                border
                                border-red-400
                                text-red-700
                                px-4
                                py-3
                                rounded-lg
                                mb-4
                            "
                        >

                            {error}

                        </div>

                    )

                }


                <form

                    onSubmit={
                        handleSubmit
                    }

                    className="
                        space-y-5
                    "
                >

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >

                            Academia

                        </label>


                        <select

                            name="academia"

                            value={
                                formData.academia
                            }

                            onChange={
                                handleChange
                            }

                            required

                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                px-3
                                py-2
                            "
                        >

                            <option
                                value=""
                            >

                                Seleccione una academia

                            </option>


                            {
                                academias.map(
                                    academia => (

                                        <option

                                            key={
                                                academia.id
                                            }

                                            value={
                                                academia.id
                                            }
                                        >

                                            {
                                                academia.nombre
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>

                    </div>


                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >

                            Nombre del curso

                        </label>


                        <input

                            type="text"

                            name="nombre"

                            value={
                                formData.nombre
                            }

                            onChange={
                                handleChange
                            }

                            required

                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                px-3
                                py-2
                            "

                            placeholder="
                                Ej: Programación Web
                            "

                        />

                    </div>


                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-1
                            "
                        >

                            Precio

                        </label>


                        <input

                            type="number"

                            name="precio"

                            value={
                                formData.precio
                            }

                            onChange={
                                handleChange
                            }

                            required

                            min="0"

                            step="0.01"

                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-lg
                                px-3
                                py-2
                            "

                            placeholder="0.00"

                        />

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-4
                        "
                    >

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-1
                                "
                            >

                                Fecha de inicio

                            </label>


                            <input

                                type="date"

                                name="fecha_inicio"

                                value={
                                    formData.fecha_inicio
                                }

                                onChange={
                                    handleChange
                                }

                                required

                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    px-3
                                    py-2
                                "

                            />

                        </div>


                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-1
                                "
                            >

                                Fecha de finalización

                            </label>


                            <input

                                type="date"

                                name="fecha_fin"

                                value={
                                    formData.fecha_fin
                                }

                                onChange={
                                    handleChange
                                }

                                required

                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-lg
                                    px-3
                                    py-2
                                "

                            />

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-4
                        "
                    >

                        <button

                            type="button"

                            onClick={() =>
                                navigate(
                                    "/cursos"
                                )
                            }

                            className="
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-gray-300
                                text-gray-700
                                hover:bg-gray-100
                            "
                        >

                            Cancelar

                        </button>


                        <button

                            type="submit"

                            disabled={
                                submitting
                            }

                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >

                            {

                                submitting

                                    ? "Guardando..."

                                    : "Crear Curso"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}