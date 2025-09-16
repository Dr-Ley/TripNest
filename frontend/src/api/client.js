// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL;

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
