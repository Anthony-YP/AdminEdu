import api from "../api/api";

export interface Paralelo {
    id: number;
    nombre: string;
    docente_nombre: string;
    dias_clase: string;
    hora_inicio: string;
    hora_fin: string;
    cupo_max: number;
    estado: string;
}

export interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    academia: number;
    academia_nombre?: string;
    imagen?: string | null;
    precio: number;
    fecha_inicio: string;
    fecha_fin: string;
    paralelos: Paralelo[];
}

const CursoMatriculaService = {
    async getCursos(): Promise<Curso[]> {
        const { data } = await api.get("/cursos/publicos/");
        return data;
    },

    async getCurso(id: number): Promise<Curso> {
        const { data } = await api.get(`/cursos/${id}/`);
        return data;
    },

    async solicitarMatricula(formData: FormData): Promise<any> {
        const { data } = await api.post(
            "/estudiante/solicitar-matricula/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    },

    async completarPerfil(datos: Record<string, unknown>): Promise<any> {
        const { data } = await api.post("/estudiante/completar-perfil/", datos);
        return data;
    },
};

export default CursoMatriculaService;
