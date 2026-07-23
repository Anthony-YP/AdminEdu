import { useEffect, useState } from "react";

import "./FeaturedCourses.css";

import CourseCard from "../CourseCard/CourseCard";

import CursoService from "../../../services/CursoService";

import type { Curso } from "../../../types/Curso";

export default function FeaturedCourses() {

    const [cursos, setCursos] = useState<Curso[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        cargarCursos();

    }, []);

    async function cargarCursos() {

        try {

            const data = await CursoService.listarCursos();

            setCursos(data);

        }

        catch(error){

            console.error(error);

        }

        finally{

            setLoading(false);

        }

    }

    return (

        <section className="featured-courses">

            <div className="section-title">

                <span>Nuestra oferta académica</span>

                <h2>Cursos disponibles</h2>

            </div>

            {

                loading ?

                (

                    <h3>Cargando cursos...</h3>

                )

                :

                (

                    <div className="courses-grid">

                        {

                            cursos.map((curso)=>(

                                <CourseCard

                                    key={curso.id}

                                    curso={curso}

                                />

                            ))

                        }

                    </div>

                )

            }

        </section>

    );

}