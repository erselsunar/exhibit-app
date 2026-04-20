"use client";

import { useEffect, useState } from "react";
import {
  fetchExpoMgmts, createExpoMgmt, updateExpoMgmt, deleteExpoMgmt,
  type ExpoMgmt,
} from "@/lib/api";

const emptyForm = { name: "", contact_person: "", email: "", phone: "" };

export default function ExpoManagementPage() {
  const [mgmts, setMgmts] = useState<ExpoMgmt[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpoMgmts().then(setMgmts).catch(console.error);
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError(null);
    setShowForm(true);
  }

  function openEdit(m: ExpoMgmt) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      contact_person: m.contact_person ?? "",
      email: m.email ?? "",
      phone: m.phone ?? "",
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
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        contact_person: form.contact_person || null,
        email: form.email || null,
        phone: form.phone || null,
      };
      if (editingId !== null) {
        const updated = await updateExpoMgmt(editingId, payload);
        setMgmts((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      } else {
        const created = await createExpoMgmt(payload);
        setMgmts((prev) => [...prev, created]);
      }
      closeForm();
    } catch {
      setError("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu organizatörü silmek istediğinize emin misiniz?")) return;
    try {
      await deleteExpoMgmt(id);
      setMgmts((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Silme işlemi başarısız.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizatörler</h1>
          <p className="text-gray-500 mt-1">Fuar organizasyon firmalarını yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Yeni Organizatör
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId !== null ? "Organizatör Düzenle" : "Yeni Organizatör Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İletişim Kişisi</label>
                <input
                  type="text"
                  value={form.contact_person}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
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
        {mgmts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">Henüz organizatör eklenmemiş.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Firma Adı</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">İletişim Kişisi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Telefon</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">E-posta</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {mgmts.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.contact_person ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{m.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{m.email ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(m)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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
