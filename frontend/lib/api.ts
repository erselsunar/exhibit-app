const BASE_URL = "http://127.0.0.1:8000";

export async function fetchCountries() {
  const res = await fetch(`${BASE_URL}/countries`);
  return res.json();
}

export async function fetchStates(countryId: number) {
  const res = await fetch(`${BASE_URL}/states?country_id=${countryId}`);
  return res.json();
}

export async function fetchCities(stateId: number) {
  const res = await fetch(`${BASE_URL}/cities?state_id=${stateId}`);
  return res.json();
}

export async function createExpo(data: any) {
  const res = await fetch(`${BASE_URL}/expos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}