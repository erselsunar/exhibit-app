"use client";

import { useEffect, useState } from "react";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
  createExpo,
} from "@/lib/api";

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

export default function CreateExpo() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | "">("");
  const [selectedState, setSelectedState] = useState<number | "">("");
  const [selectedCity, setSelectedCity] = useState<number | "">("");

  const [expoName, setExpoName] = useState("");
  const [expoYear, setExpoYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Countries load
  useEffect(() => {
    fetchCountries().then(setCountries).catch(console.error);
  }, []);

  // States load
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(Number(selectedCountry)).then(setStates).catch(console.error);
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // Cities load
  useEffect(() => {
    if (selectedState) {
      fetchCities(Number(selectedState)).then(setCities).catch(console.error);
      setSelectedCity("");
    }
  }, [selectedState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createExpo({
        expo_name: expoName,
        expo_year: expoYear,
        venue_id: 1, // şimdilik sabit
        expo_mgmt_id: 1,
        start_date: startDate,
        end_date: endDate,
      });
      setSuccess(true);
      // Reset form
      setExpoName("");
      setStartDate("");
      setEndDate("");
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
    } catch (err) {
      setError("Expo oluşturma başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Yeni Expo Oluştur
          </h1>
          <p className="text-gray-600">
            Fuar bilgilerinizi aşağıdaki formdan girin
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expo Name */}
            <div>
              <label
                htmlFor="expoName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expo Adı
              </label>
              <input
                id="expoName"
                type="text"
                value={expoName}
                onChange={(e) => setExpoName(e.target.value)}
                placeholder="Örn: Technology Expo 2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Expo Year */}
            <div>
              <label
                htmlFor="expoYear"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expo Yılı
              </label>
              <input
                id="expoYear"
                type="number"
                value={expoYear}
                onChange={(e) => setExpoYear(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Başlangıç Tarihi
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bitiş Tarihi
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Location Selectors */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ülke
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) =>
                    setSelectedCountry(Number(e.target.value) || "")
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Ülke Seçin</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Eyalet / İl
                </label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) =>
                    setSelectedState(Number(e.target.value) || "")
                  }
                  disabled={!selectedCountry}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Eyalet Seçin</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Şehir
                </label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) =>
                    setSelectedCity(Number(e.target.value) || "")
                  }
                  disabled={!selectedState}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Şehir Seçin</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">
                  Expo başarıyla oluşturuldu!
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !expoName || !startDate || !endDate}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? "Oluşturuluyor..." : "Expo Oluştur"}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Tüm alanlar zorunludur</p>
        </div>
      </div>
    </div>
  );
}
