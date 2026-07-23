import "./Hero.css";

interface HeroProps {
    onExplorarCursos: () => void;
}

export default function Hero({
    onExplorarCursos,
}: HeroProps) {

    return (

        <section className="hero">

            <div className="hero-content">

                <span className="hero-tag">
                    Academia de Formación Profesional
                </span>

                <h1>

                    Aprende hoy las habilidades
                    <br />
                    del mañana.

                </h1>

                <p>

                    En AdminEdu impulsamos tu crecimiento profesional
                    mediante cursos especializados impartidos por docentes
                    calificados. Desarrolla nuevas competencias y prepárate
                    para los retos del mundo laboral.

                </p>

                <button
                    className="hero-button"
                    onClick={onExplorarCursos}
                >

                    Explorar cursos

                </button>

            </div>

            <div className="hero-image">

                <img
                    src="/images/hero.png"
                    alt="AdminEdu"
                />

            </div>

        </section>

    );

}