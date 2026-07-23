import "./About.css";

export default function About() {

    return (

        <section className="about">

            <div className="about-image">

                <img
                    src="/images/about.jpg"
                    alt="Academia AdminEdu"
                />

            </div>

            <div className="about-content">

                <span className="about-subtitle">
                    ¿Quiénes somos?
                </span>

                <h2>
                    Formamos profesionales preparados para el futuro.
                </h2>

                <p>

                    AdminEdu es una academia orientada a la formación
                    académica y profesional mediante cursos especializados,
                    impartidos por docentes altamente capacitados y con una
                    metodología centrada en el aprendizaje práctico.

                </p>

                <div className="about-grid">

                    <div className="about-card">

                        <h3>Misión</h3>

                        <p>

                            Brindar educación de calidad mediante programas
                            académicos innovadores que fortalezcan las
                            competencias profesionales de nuestros estudiantes.

                        </p>

                    </div>

                    <div className="about-card">

                        <h3>Visión</h3>

                        <p>

                            Ser una academia referente en formación continua,
                            reconocida por la excelencia académica y el impacto
                            positivo en la sociedad.

                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}