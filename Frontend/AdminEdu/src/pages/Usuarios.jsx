import { useAuth } from "../hooks/useAuth";
import api from "../api/api";


export default function Usuarios() {

    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await api.get("/usuarios/");
                setUsuarios(response.data);
            } catch (err) {
                setError("Error al cargar usuarios");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">Cargando usuarios...</div>
            </div>
        );
    }


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Administración de Usuarios
                </h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                    + Nuevo Usuario
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Usuario</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Grupos</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Staff</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Activo</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{u.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{u.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {u.groups?.length > 0 ? (
                                            <div className="flex gap-1">
                                                {u.groups.map((g, i) => (
                                                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                        {g}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${u.is_staff ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                            {u.is_staff ? "Sí" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {u.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                        <button className="text-red-600 hover:text-red-800">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}