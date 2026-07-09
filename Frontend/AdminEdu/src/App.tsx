import { BrowserRouter, Route, Routes } from "react-router-dom";
import CursosList from "./components/CursosList"
import CursosForm from "./components/CursosForm"
import Header from "./components/Header"

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto">
        <Header />
        <Routes>
          <Route path="/" element={<CursosList />} />
          <Route path="/nuevo-curso" element={<CursosForm />} />
          <Route path="/editar-curso/:id" element={<CursosForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App;
