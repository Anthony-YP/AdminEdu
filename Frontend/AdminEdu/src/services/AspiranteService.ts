import api from "../api/api";

export interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    academia: number;
    academia_nombre?: string;
    paralelos_count?: number;
}

export interface PerfilAspirante {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    grupos: string[];
}

export interface SolicitudMatricula {
    id: number;
    curso: number;
    curso_nombre?: string;
    estado: string;
    fecha_solicitud: string;
    comentario: string;
}

const AspiranteService = {
    async getCursos(): Promise<Curso[]> {
        const { data } = await api.get("/cursos/publicos/");
        return data;
    },

    async getCurso(id: number): Promise<Curso> {
        const { data } = await api.get(`/cursos/${id}/`);
        return data;
    },

    async getPerfil(): Promise<PerfilAspirante> {
        const { data } = await api.get("/aspirante/perfil/");
        return data;
    },

    async getSolicitudes(): Promise<SolicitudMatricula[]> {
        const { data } = await api.get("/aspirante/solicitudes/");
        return data;
    },

    async solicitarMatricula(cursoId: number, comentario?: string): Promise<any> {
        const { data } = await api.post("/matriculas/", {
            curso: cursoId,
            comentario: comentario || "",
        });
        return data;
    },
};

export default AspiranteService;
