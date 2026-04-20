const BASE_URL = "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Location helpers
export function fetchCountries() {
  return request<Country[]>("/countries");
}
export function fetchStates(countryId: number) {
  return request<State[]>(`/states?country_id=${countryId}`);
}
export function fetchCities(stateId: number) {
  return request<City[]>(`/cities?state_id=${stateId}`);
}

// Venues
export function fetchVenues(cityId?: number) {
  const qs = cityId ? `?city_id=${cityId}` : "";
  return request<Venue[]>(`/venues${qs}`);
}
export function createVenue(data: Omit<Venue, "id">) {
  return request<Venue>("/venues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function updateVenue(id: number, data: Partial<Omit<Venue, "id">>) {
  return request<Venue>(`/venues/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export function deleteVenue(id: number) {
  return request<{ message: string }>(`/venues/${id}`, { method: "DELETE" });
}

// Expo Management
export function fetchExpoMgmts() {
  return request<ExpoMgmt[]>("/expo-mgmt");
}
export function createExpoMgmt(data: Omit<ExpoMgmt, "id">) {
  return request<ExpoMgmt>("/expo-mgmt", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function updateExpoMgmt(
  id: number,
  data: Partial<Omit<ExpoMgmt, "id">>,
) {
  return request<ExpoMgmt>(`/expo-mgmt/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export function deleteExpoMgmt(id: number) {
  return request<{ message: string }>(`/expo-mgmt/${id}`, { method: "DELETE" });
}

// Expos
export function fetchExpos() {
  return request<Expo[]>("/expos");
}
export function createExpo(data: Omit<Expo, "id">) {
  return request<Expo>("/expos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function updateExpo(id: number, data: Partial<Omit<Expo, "id">>) {
  return request<Expo>(`/expos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export function deleteExpo(id: number) {
  return request<{ message: string }>(`/expos/${id}`, { method: "DELETE" });
}

// Booths
export function fetchBooths(expoId: number) {
  return request<Booth[]>(`/booths?expo_id=${expoId}`);
}
export function createBooth(data: Omit<Booth, "id">) {
  return request<Booth>("/booths", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function updateBooth(id: number, data: Partial<Omit<Booth, "id">>) {
  return request<Booth>(`/booths/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export function deleteBooth(id: number) {
  return request<{ message: string }>(`/booths/${id}`, { method: "DELETE" });
}

// Types
export interface Country {
  id: number;
  name: string;
}
export interface State {
  id: number;
  name: string;
}
export interface City {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  short_name: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city_id: number | null;
  tax_number: string | null;
}

// Clients
export function fetchClients() {
  return request<Client[]>("/clients");
}
export function createClient(data: Omit<Client, "id">) {
  return request<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function updateClient(id: number, data: Partial<Omit<Client, "id">>) {
  return request<Client>(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export function deleteClient(id: number) {
  return request<{ message: string }>(`/clients/${id}`, { method: "DELETE" });
}

export interface Venue {
  id: number;
  venue_name: string;
  city_id: number;
  address: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface ExpoMgmt {
  id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
}

export interface Expo {
  id: number;
  expo_name: string;
  expo_year: number;
  venue_id: number;
  start_date: string;
  end_date: string;
  expo_mgmt_id: number;
}

export interface Booth {
  id: number;
  booth_id: string;
  expo_id: number;
  partner_id: number | null;
  dimension: string | null;
  uom: string | null;
}
