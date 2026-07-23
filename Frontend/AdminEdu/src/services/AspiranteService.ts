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

export interface PerfilAspirante {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    grupos: string[];
    photo?: string | null;
}

export interface SolicitudMatricula {
    id: number;
    curso: number;
    curso_nombre: string;
    paralelo: string;
    paralelo_id: number;
    estado: string;
    fecha_solicitud: string;
    fecha_aprobacion?: string;
    comentario: string;
    comprobante_url?: string;
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

    async solicitarMatricula(formData: FormData): Promise<any> {
        const { data } = await api.post(
            "/aspirante/solicitar-matricula/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    },
};

export default AspiranteService;
