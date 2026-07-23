import api from "../api/api";
import { Curso } from "../types/Curso";

class CursoService {

    async listarCursos(): Promise<Curso[]> {

        const response = await api.get("/cursos/");

        return response.data;
    }

    async obtenerCurso(id: number): Promise<Curso> {

        const response = await api.get(`/cursos/${id}/`);

        return response.data;
    }

}

export default new CursoService();