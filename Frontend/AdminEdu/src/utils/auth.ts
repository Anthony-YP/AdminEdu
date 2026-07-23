import { Usuario } from "../types/Auth";

export function getDefaultRoute(
    usuario: Usuario
): string {
    if (usuario.groups.includes("Director") || usuario.groups.includes("Secretaria")) {
        return "/dashboard";
    }

    if (usuario.groups.includes("Estudiante")) {
        return "/dashboard";
    }

    if (usuario.groups.includes("Aspirante")) {
        return "/aspirante";
    }

    return "/dashboard";
}
