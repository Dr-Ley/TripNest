// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL;

export async function fetchHotels() {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    if (!response.ok) throw new Error("Failed to fetch hotels");
    return response.json();
  }
  
  export async function fetchRestaurants() {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) throw new Error("Failed to fetch restaurants");
    return response.json();
  }
  
  export async function fetchAttractions() {
    const response = await fetch(`${API_BASE_URL}/attractions`);
    if (!response.ok) throw new Error("Failed to fetch attractions");
    return response.json();
  }
  
  export async function getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  }
export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error("API Fetch Error:", err);
    return [];
  }
}
