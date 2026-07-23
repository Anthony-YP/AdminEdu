import "./Header.css";

interface HeaderProps {
    onLogin: () => void;
}

const Header = ({ onLogin }: HeaderProps) => {
    return (
        <header className="header">

            <div className="logo">
                AdminEdu
            </div>

            <nav>

                <button
                    className="login-button"
                    onClick={onLogin}
                >
                    Ingresar al Sistema
                </button>

            </nav>

        </header>
    );
};

export default Header;