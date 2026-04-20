"use client";

import { useEffect, useState } from "react";
import {
  fetchExpos, createExpo, updateExpo, deleteExpo,
  fetchVenues, fetchExpoMgmts,
  type Expo, type Venue, type ExpoMgmt,
} from "@/lib/api";

const currentYear = new Date().getFullYear();

const emptyForm = {
  expo_name: "",
  expo_year: currentYear,
  venue_id: 0,
  expo_mgmt_id: 0,
  start_date: "",
  end_date: "",
};

export default function ExposPage() {
  const [expos, setExpos] = useState<Expo[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [mgmts, setMgmts] = useState<ExpoMgmt[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpos().then(setExpos).catch(console.error);
    fetchVenues().then(setVenues).catch(console.error);
    fetchExpoMgmts().then(setMgmts).catch(console.error);
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError(null);
    setShowForm(true);
  }

  function openEdit(e: Expo) {
    setEditingId(e.id);
    setForm({
      expo_name: e.expo_name,
      expo_year: e.expo_year,
      venue_id: e.venue_id,
      expo_mgmt_id: e.expo_mgmt_id,
      start_date: e.start_date,
      end_date: e.end_date,
    });
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.venue_id || !form.expo_mgmt_id) {
      setError("Lütfen mekan ve organizatör seçin.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        const updated = await updateExpo(editingId, form);
        setExpos((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        const created = await createExpo(form);
        setExpos((prev) => [...prev, created]);
      }
      closeForm();
    } catch {
      setError("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu fuarı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteExpo(id);
      setExpos((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Silme işlemi başarısız.");
    }
  }

  function venueName(id: number) {
    return venues.find((v) => v.id === id)?.venue_name ?? `#${id}`;
  }

  function mgmtName(id: number) {
    return mgmts.find((m) => m.id === id)?.name ?? `#${id}`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fuarlar</h1>
          <p className="text-gray-500 mt-1">Fuar etkinliklerini yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Yeni Fuar
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId !== null ? "Fuar Düzenle" : "Yeni Fuar Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuar Adı *</label>
                <input
                  type="text"
                  value={form.expo_name}
                  onChange={(e) => setForm({ ...form, expo_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yıl *</label>
                <input
                  type="number"
                  value={form.expo_year}
                  onChange={(e) => setForm({ ...form, expo_year: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mekan *</label>
                <select
                  value={form.venue_id || ""}
                  onChange={(e) => setForm({ ...form, venue_id: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Mekan Seçin</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.venue_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizatör *</label>
                <select
                  value={form.expo_mgmt_id || ""}
                  onChange={(e) => setForm({ ...form, expo_mgmt_id: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Organizatör Seçin</option>
                  {mgmts.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi *</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi *</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
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
        {expos.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">Henüz fuar eklenmemiş.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fuar Adı</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Yıl</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mekan</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Organizatör</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tarihler</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {expos.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{e.expo_name}</td>
                  <td className="px-4 py-3 text-gray-600">{e.expo_year}</td>
                  <td className="px-4 py-3 text-gray-600">{venueName(e.venue_id)}</td>
                  <td className="px-4 py-3 text-gray-600">{mgmtName(e.expo_mgmt_id)}</td>
                  <td className="px-4 py-3 text-gray-600">{e.start_date} – {e.end_date}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(e)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
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
