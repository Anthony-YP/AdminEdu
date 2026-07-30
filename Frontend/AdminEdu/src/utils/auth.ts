import { Usuario } from "../types/Auth";

export function getDefaultRoute(
    usuario: Usuario
): string {
    const groups = usuario.groups || [];

    if (groups.includes("Administrador")) {
        return "/admin";
    }

    if (groups.includes("Estudiante")) {
        return "/estudiante-dashboard";
    }

    // Director, Secretaria, Docente, Representante
    return "/dashboard";
}
