import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { BookOpen, Bell, ClipboardCheck, GraduationCap, UserCircle, HelpCircle } from "lucide-react";

export default function EstudianteDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumen, setResumen] = useState({ matriculas: 0, cursos: 0, notificaciones: 0 });
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const [matriculasRes, notificacionesRes] = await Promise.all([
          api.get("/matriculas/"),
          api.get("/notificaciones/"),
        ]);

        setResumen({
          matriculas: matriculasRes.data?.length || 0,
          cursos: Math.max(1, matriculasRes.data?.length || 0),
          notificaciones: notificacionesRes.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el resumen del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hola, {user?.username || "estudiante"}</h1>
            <p className="mt-2 text-blue-100">Tu espacio para revisar tu perfil, tus matrículas y tus notificaciones de forma rápida.</p>
          </div>
          <Button variant="secondary" className="bg-white/15 text-white border-white/20 hover:bg-white/25" onClick={() => setMostrarAyuda(!mostrarAyuda)}>
            <HelpCircle className="mr-2 h-4 w-4" /> Ayuda
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {mostrarAyuda && (
        <Alert variant="info">
          <strong>¿Necesitas ayuda?</strong> Revisa tu perfil para actualizar datos, entra a Matrículas para ver el estado de tus solicitudes y usa Historial para consultar tus avances académicos.
        </Alert>
      )}

      {loading ? (
        <div className="text-gray-500">Cargando resumen...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Cursos activos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{resumen.cursos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5" /> Matrículas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{resumen.matriculas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{resumen.notificaciones}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCircle className="w-5 h-5" /> Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" onClick={() => navigate("/estudiante-perfil")}>Mi perfil</Button>
            <Button className="w-full justify-start" onClick={() => navigate("/estudiante-matriculas")}>Mis matrículas</Button>
            <Button className="w-full justify-start" onClick={() => navigate("/estudiante-historial")}>Historial académico</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Próximos pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
              <li>Actualiza tu información personal en Mi Perfil.</li>
              <li>Consulta el estado de tus solicitudes en Mis Matrículas.</li>
              <li>Revisa tus avances en Historial académico.</li>
              <li>Recibe alertas importantes en Notificaciones.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
