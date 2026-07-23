import "./Topbar.css";

export default function Topbar() {

    return (

        <header className="topbar">

            <div>

                <h1>

                    Portal del Aspirante

                </h1>

            </div>

            <div className="topbar-user">

                <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Usuario"
                />

                <div>

                    <strong>

                        Francisco García

                    </strong>

                    <p>

                        francisco@gmail.com

                    </p>

                </div>

            </div>

        </header>

    );

}