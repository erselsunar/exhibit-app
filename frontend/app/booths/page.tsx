"use client";

import { useEffect, useState } from "react";
import {
  fetchExpos, fetchBooths, createBooth, updateBooth, deleteBooth,
  fetchClients,
  type Expo, type Booth, type Client,
} from "@/lib/api";

const emptyForm = {
  booth_id: "",
  expo_id: 0,
  partner_id: "",
  dimension: "",
  uom: "",
};

export default function BoothsPage() {
  const [expos, setExpos] = useState<Expo[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedExpoId, setSelectedExpoId] = useState<number | "">("");
  const [booths, setBooths] = useState<Booth[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [boothsLoading, setBoothsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpos().then(setExpos).catch(console.error);
    fetchClients().then(setClients).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedExpoId) {
      setBoothsLoading(true);
      fetchBooths(Number(selectedExpoId))
        .then(setBooths)
        .catch(console.error)
        .finally(() => setBoothsLoading(false));
    } else {
      setBooths([]);
    }
  }, [selectedExpoId]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, expo_id: Number(selectedExpoId) || 0 });
    setError(null);
    setShowForm(true);
  }

  function openEdit(b: Booth) {
    setEditingId(b.id);
    setForm({
      booth_id: b.booth_id,
      expo_id: b.expo_id,
      partner_id: b.partner_id !== null ? String(b.partner_id) : "",
      dimension: b.dimension ?? "",
      uom: b.uom ?? "",
    });
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.expo_id) {
      setError("Lütfen bir fuar seçin.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        booth_id: form.booth_id,
        expo_id: form.expo_id,
        partner_id: form.partner_id ? Number(form.partner_id) : null,
        dimension: form.dimension || null,
        uom: form.uom || null,
      };
      if (editingId !== null) {
        const updated = await updateBooth(editingId, payload);
        setBooths((prev) => prev.map((b) => (b.id === editingId ? updated : b)));
      } else {
        const created = await createBooth(payload);
        setBooths((prev) => [...prev, created]);
      }
      closeForm();
    } catch {
      setError("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu standı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteBooth(id);
      setBooths((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Silme işlemi başarısız.");
    }
  }

  function expoName(id: number) {
    return expos.find((e) => e.id === id)?.expo_name ?? `#${id}`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Standlar</h1>
          <p className="text-gray-500 mt-1">Fuar standlarını yönetin</p>
        </div>
        <button
          onClick={openCreate}
          disabled={!selectedExpoId}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Yeni Stand
        </button>
      </div>

      {/* Expo filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fuar Seçin</label>
        <select
          value={selectedExpoId}
          onChange={(e) => setSelectedExpoId(Number(e.target.value) || "")}
          className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Fuar Seçin</option>
          {expos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.expo_name} ({e.expo_year})
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId !== null ? "Stand Düzenle" : "Yeni Stand Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stand No *</label>
                <input
                  type="text"
                  value={form.booth_id}
                  onChange={(e) => setForm({ ...form, booth_id: e.target.value })}
                  placeholder="Örn: A-101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuar *</label>
                <select
                  value={form.expo_id || ""}
                  onChange={(e) => setForm({ ...form, expo_id: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Fuar Seçin</option>
                  {expos.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.expo_name} ({e.expo_year})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Boyut</label>
                <input
                  type="text"
                  value={form.dimension}
                  onChange={(e) => setForm({ ...form, dimension: e.target.value })}
                  placeholder="Örn: 3x3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birim</label>
                <input
                  type="text"
                  value={form.uom}
                  onChange={(e) => setForm({ ...form, uom: e.target.value })}
                  placeholder="Örn: m²"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
                <select
                  value={form.partner_id}
                  onChange={(e) => setForm({ ...form, partner_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Müşteri Seçin</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.short_name ? ` (${c.short_name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {loading ? "Kaydediliyor..." : editingId !== null ? "Güncelle" : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!selectedExpoId ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">Standları görüntülemek için önce bir fuar seçin.</p>
          </div>
        ) : boothsLoading ? (
          <div className="p-12 text-center text-gray-400">
            <p>Yükleniyor...</p>
          </div>
        ) : booths.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">Bu fuarda henüz stand eklenmemiş.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Stand No</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fuar</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Boyut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Birim</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Müşteri</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {booths.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.booth_id}</td>
                  <td className="px-4 py-3 text-gray-600">{expoName(b.expo_id)}</td>
                  <td className="px-4 py-3 text-gray-600">{b.dimension ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{b.uom ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.partner_id ? (clients.find((c) => c.id === b.partner_id)?.name ?? `#${b.partner_id}`) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(b)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
