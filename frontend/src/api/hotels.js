// src/api/hotels.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ------------------------------
   READ (existing)
-------------------------------*/
export async function fetchHotels() {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels`);
    if (!res.ok) throw new Error("Failed to fetch hotels");
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("Error fetching hotels:", err);
    return [];
  }
}

/* ------------------------------
   CREATE
-------------------------------*/
export async function createItem(hotelData) {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotelData),
    });
    if (!res.ok) throw new Error("Failed to create hotel");
    return await res.json();
  } catch (err) {
    console.error("Error creating hotel:", err);
    throw err;
  }
}

/* ------------------------------
   UPDATE
-------------------------------*/
export async function updateItem(id, hotelData) {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotelData),
    });
    if (!res.ok) throw new Error("Failed to update hotel");
    return await res.json();
  } catch (err) {
    console.error("Error updating hotel:", err);
    throw err;
  }
}

/* ------------------------------
   DELETE
-------------------------------*/
export async function deleteItem(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete hotel");
    return await res.json();
  } catch (err) {
    console.error("Error deleting hotel:", err);
    throw err;
  }
}
