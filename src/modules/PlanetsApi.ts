import type { Planet } from "./PlanetsTypes";

const isDevelopment = import.meta.env.DEV;
const isGitHubPages = window.location.hostname.includes('github.io');

// Определяем URL в зависимости от окружения
const getAPIBaseURL = () => {
  if (isDevelopment) {
    return 'https://localhost:3000'; // Dev - напрямую к бекенду
  }
  if (isGitHubPages) {
    return 'https://172.20.10.3:3000'; // GitHub Pages → твой IP:3000 → прокси → :8080
  }
  return 'https://localhost:3000'; // Fallback
};

const API_BASE_URL = getAPIBaseURL();

export async function listPlanets(params?: { name?: string}): Promise<Planet[]> {
  try {
    let path = `${API_BASE_URL}/api/v1/planets`;
    
    if (params) {
      const query = new URLSearchParams();
      if (params.name) query.append("planet_name", params.name);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }

    console.log('🔧 API Request to:', path);
    console.log('🔧 Environment:', isDevelopment ? 'DEV' : 'PROD');
    console.log('🔧 Is GitHub Pages:', isGitHubPages);

    const res = await fetch(path, { 
      mode: 'cors',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } 
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('❌ API error, using mocks', err);
    return [];
  }
}

export async function getPlanet(id: number): Promise<Planet | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/planet/${id}`, { 
      mode: 'cors',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } 
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('❌ API error, using mocks');
    return null;
  }
}

export async function getResearchCart(): Promise<{id: number, planets_count: number} | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/research/research-cart`, { 
      mode: 'cors',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } 
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('❌ API error getting research cart');
    return null;
  }
}