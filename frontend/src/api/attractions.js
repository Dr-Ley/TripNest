// src/api/attractions.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ------------------------------
   READ (existing)
-------------------------------*/
export async function fetchAttractions() {
  try {
    const res = await fetch(`${API_BASE_URL}/attractions`);
    if (!res.ok) throw new Error("Failed to fetch attractions");
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("Error fetching attractions:", err);
    return [];
  }
}

/* ------------------------------
   CREATE
-------------------------------*/
export async function createItem(attractionData) {
  try {
    const res = await fetch(`${API_BASE_URL}/attractions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attractionData),
    });
    if (!res.ok) throw new Error("Failed to create attraction");
    return await res.json();
  } catch (err) {
    console.error("Error creating attraction:", err);
    throw err;
  }
}

/* ------------------------------
   UPDATE
-------------------------------*/
export async function updateItem(id, attractionData) {
  try {
    const res = await fetch(`${API_BASE_URL}/attractions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attractionData),
    });
    if (!res.ok) throw new Error("Failed to update attraction");
    return await res.json();
  } catch (err) {
    console.error("Error updating attraction:", err);
    throw err;
  }
}

/* ------------------------------
   DELETE
-------------------------------*/
export async function deleteItem(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/attractions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete attraction");
    return await res.json();
  } catch (err) {
    console.error("Error deleting attraction:", err);
    throw err;
  }
}