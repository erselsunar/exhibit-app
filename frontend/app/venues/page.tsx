"use client";

import { useEffect, useState } from "react";
import {
  fetchCountries, fetchStates, fetchCities, fetchVenues,
  createVenue, updateVenue, deleteVenue,
  type Country, type State, type City, type Venue,
} from "@/lib/api";

const emptyForm = {
  venue_name: "",
  city_id: 0,
  address: "",
  postal_code: "",
  phone: "",
  email: "",
  website: "",
};

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | "">("");
  const [selectedState, setSelectedState] = useState<number | "">("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenues().then(setVenues).catch(console.error);
    fetchCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(Number(selectedCountry)).then(setStates).catch(console.error);
      setSelectedState("");
      setCities([]);
      setForm((f) => ({ ...f, city_id: 0 }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetchCities(Number(selectedState)).then(setCities).catch(console.error);
      setForm((f) => ({ ...f, city_id: 0 }));
    }
  }, [selectedState]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setSelectedCountry("");
    setSelectedState("");
    setCities([]);
    setError(null);
    setShowForm(true);
  }

  function openEdit(v: Venue) {
    setEditingId(v.id);
    setForm({
      venue_name: v.venue_name,
      city_id: v.city_id,
      address: v.address ?? "",
      postal_code: v.postal_code ?? "",
      phone: v.phone ?? "",
      email: v.email ?? "",
      website: v.website ?? "",
    });
    setSelectedCountry("");
    setSelectedState("");
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city_id && editingId === null) {
      setError("Lütfen bir şehir seçin.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        const updated = await updateVenue(editingId, form);
        setVenues((prev) => prev.map((v) => (v.id === editingId ? updated : v)));
      } else {
        const created = await createVenue(form);
        setVenues((prev) => [...prev, created]);
      }
      closeForm();
    } catch {
      setError("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu mekanı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteVenue(id);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch {
      alert("Silme işlemi başarısız.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mekanlar</h1>
          <p className="text-gray-500 mt-1">Fuar mekanlarını yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Yeni Mekan
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId !== null ? "Mekan Düzenle" : "Yeni Mekan Ekle"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mekan Adı *</label>
                <input
                  type="text"
                  value={form.venue_name}
                  onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(Number(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ülke Seçin</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eyalet / İl</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(Number(e.target.value) || "")}
                  disabled={!selectedCountry}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Eyalet Seçin</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir {editingId === null && "*"}</label>
                <select
                  value={form.city_id || ""}
                  onChange={(e) => setForm({ ...form, city_id: Number(e.target.value) || 0 })}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Şehir Seçin</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                <input
                  type="text"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
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
        {venues.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">Henüz mekan eklenmemiş.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Mekan Adı</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Adres</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Telefon</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">E-posta</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.venue_name}</td>
                  <td className="px-4 py-3 text-gray-600">{v.address ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{v.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{v.email ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(v)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
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
