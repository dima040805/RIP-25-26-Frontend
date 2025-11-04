

import type { Planet } from "./PlanetsTypes";

export async function listPlanets(params?: { name?: string}): Promise<Planet[]> {
  try {
    const API_BASE = "http://192.168.1.76:8080";
    let path = `${API_BASE}/api/v1/planets`;    if (params) {
      const query = new URLSearchParams();
      if (params.name) query.append("planet_name", params.name);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }

    const res = await fetch('/api/v1/planets', { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getPlanet(id: number): Promise<Planet | null> {
  try {
    const res = await fetch(`/api/v1/planet/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}