import { useEffect, useState } from "react";
import api from "../api/api";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function EstudiantePerfil() {
  const [persona, setPersona] = useState(null);
  const [formData, setFormData] = useState({ correo: "", telefono: "", direccion: "" });
  const [hasPersona, setHasPersona] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const response = await api.get("/personas/");
        const data = response.data?.[0] || null;
        setPersona(data);
        setHasPersona(Boolean(data));
        setFormData({
          correo: data?.correo || "",
          telefono: data?.telefono || "",
          direccion: data?.direccion || "",
        });
      } catch (err) {
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.patch(`/personas/${persona.id}/`, formData);
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      setError("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Cargando perfil...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-sm text-gray-500">Revisa y actualiza tus datos personales de forma segura.</p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!hasPersona ? (
        <Alert variant="info">Aún no tienes un perfil asociado. Solicita que se te registre la información personal para completar esta sección.</Alert>
      ) : (
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p><strong>Nombres:</strong> {persona?.nombres || "—"}</p>
          <p><strong>Apellidos:</strong> {persona?.apellidos || "—"}</p>
          <p><strong>Correo:</strong> {persona?.correo || "—"}</p>
          <p className="text-xs text-gray-500">Puedes editar correo, teléfono y dirección desde el formulario de abajo.</p>
          <p><strong>Teléfono:</strong> {persona?.telefono || "—"}</p>
          <p><strong>Documento:</strong> {persona?.numero_identificacion || "—"}</p>
          <p><strong>Tipo de documento:</strong> {persona?.tipo_documento || "—"}</p>
          <p><strong>Dirección:</strong> {persona?.direccion || "—"}</p>
        </CardContent>
      </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Editar datos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Correo</label>
              <input className="mt-1 w-full rounded border px-3 py-2" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Teléfono</label>
              <input className="mt-1 w-full rounded border px-3 py-2" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium">Dirección</label>
              <input className="mt-1 w-full rounded border px-3 py-2" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
            </div>
            <Button type="submit" isLoading={saving}>Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}