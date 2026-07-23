import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">

                    <h2>AdminEdu</h2>

                    <p>
                        Academia especializada en formación tecnológica,
                        impulsando el aprendizaje con excelencia académica.
                    </p>

                </div>

                <div className="footer-links">

                    <h3>Enlaces</h3>

                    <ul>
                        <li><a href="#inicio">Inicio</a></li>
                        <li><a href="#nosotros">Nosotros</a></li>
                        <li><a href="#cursos">Cursos</a></li>
                    </ul>

                </div>

                <div className="footer-contact">

                    <h3>Contacto</h3>

                    <p>📍 Quito - Ecuador</p>

                    <p>📞 0999999999</p>

                    <p>✉ adminedu@gmail.com</p>

                </div>

            </div>

            <div className="footer-bottom">

                © 2026 AdminEdu. Todos los derechos reservados.

            </div>

        </footer>
    );
}