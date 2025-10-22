

import type { Planet } from "./PlanetsTypes";

export async function listPlanets(params?: { name?: string; date_from?: string; date_to?: string }): Promise<Planet[]> {
  try {
    let path = "/api/v1/planets";
    if (params) {
      const query = new URLSearchParams();
      if (params.name) query.append("planet_name", params.name);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }

    const res = await fetch(path, { headers: { Accept: "application/json" } });
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