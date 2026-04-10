"use client";

import { useEffect, useState } from "react";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
  createExpo
} from "@/lib/api";

export default function CreateExpo() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const [expoName, setExpoName] = useState("");

  // Countries load
  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  // States load
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry).then(setStates);
    }
  }, [selectedCountry]);

  // Cities load
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState).then(setCities);
    }
  }, [selectedState]);

  const handleSubmit = async () => {
    await createExpo({
      expo_name: expoName,
      expo_year: 2025,
      venue_id: 1, // şimdilik sabit
      expo_mgmt_id: 1,
      start_date: "2025-06-01",
      end_date: "2025-06-10"
    });

    alert("Expo created!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Expo</h1>

      {/* Country */}
      <select onChange={(e) => setSelectedCountry(Number(e.target.value))}>
        <option>Select Country</option>
        {countries.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* State */}
      <select onChange={(e) => setSelectedState(Number(e.target.value))}>
        <option>Select State</option>
        {states.map((s: any) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {/* City */}
      <select onChange={(e) => setSelectedCity(Number(e.target.value))}>
        <option>Select City</option>
        {cities.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Expo Name"
        onChange={(e) => setExpoName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Create Expo
      </button>
    </div>
  );
}