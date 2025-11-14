

import { API_BASE_URL } from "../config";
import type { Planet } from "./PlanetsTypes";

export async function listPlanets(params?: { name?: string}): Promise<Planet[]> {
  try {
    let path = `${API_BASE_URL}/v1/planets`;    if (params) {
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
    const res = await fetch(`${API_BASE_URL}/v1/planet/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}