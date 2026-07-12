import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import CursosList from "./components/CursosList";
import Login from "./pages/Login";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<CursosList />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
