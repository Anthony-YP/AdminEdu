// services/permissions.js
import { MODULES } from '../config/modules';

export const getAvailableModules = (user) => {
    if (!user?.grupos) return [];
    return MODULES.filter(module =>
        module.roles.some(role => user.grupos.includes(role))
    );
};