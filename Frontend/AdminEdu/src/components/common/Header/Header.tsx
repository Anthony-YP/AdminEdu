import "./Header.css";

interface HeaderProps {
    onLogin: () => void;
}

export default function Header({
    onLogin,
}: HeaderProps) {

    return (

        <header className="header">

            <div className="logo">

                AdminEdu

            </div>

            <button
                className="login-button"
                onClick={onLogin}
            >

                Ingresar al sistema

            </button>

        </header>

    );

}