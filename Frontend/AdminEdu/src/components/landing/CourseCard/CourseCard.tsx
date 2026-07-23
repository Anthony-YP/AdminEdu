import "./CourseCard.css";

import type { Curso } from "../../../types/Curso";

interface Props {

    curso: Curso;

    onSolicitar?: (curso: Curso) => void;

}

export default function CourseCard({

    curso,

    onSolicitar,

}: Props) {

    const apiBase = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "");
    const imagen = curso.imagen ? `${apiBase}${curso.imagen}` : "/images/course-placeholder.jpg";

    return (

        <article className="course-card">

            <div className="course-image-container">

                <img
                    src={imagen}
                    alt={curso.nombre}
                    className="course-image"
                />

                <span className="course-status">

                    Disponible

                </span>

            </div>

            <div className="course-content">

                <span className="course-academy">

                    {curso.academia_nombre}

                </span>

                <h3>

                    {curso.nombre}

                </h3>

                <p>

                    {curso.descripcion}

                </p>

                <div className="course-date">

                    📅 {curso.fecha_inicio} - {curso.fecha_fin}

                </div>

                <div className="course-footer">

                    <span className="course-price">

                        ${curso.precio}

                    </span>

                    <button
                        onClick={() => onSolicitar?.(curso)}
                    >

                        Ver detalles

                    </button>

                </div>

            </div>

        </article>

    );

}