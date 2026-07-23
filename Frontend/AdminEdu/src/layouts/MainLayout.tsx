import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {

    return (

        <div className="flex h-screen bg-gray-50 overflow-hidden">

            <Header />

            <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">

                <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}