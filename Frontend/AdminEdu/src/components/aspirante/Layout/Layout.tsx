import "./Layout.css";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({
    children,
}: LayoutProps) {

    return (

        <div className="layout">

            <Sidebar />

            <div className="layout-content">

                <Topbar />

                <main>

                    {children}

                </main>

            </div>

        </div>

    );

}