// src/api/restaurants.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ------------------------------
   READ (existing)
-------------------------------*/
export async function fetchRestaurants() {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants`);
    if (!res.ok) throw new Error("Failed to fetch restaurants");
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    return [];
  }
}

/* ------------------------------
   CREATE
-------------------------------*/
export async function createItem(restaurantData) {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurantData),
    });
    if (!res.ok) throw new Error("Failed to create restaurant");
    return await res.json();
  } catch (err) {
    console.error("Error creating restaurant:", err);
    throw err;
  }
}

/* ------------------------------
   UPDATE
-------------------------------*/
export async function updateItem(id, restaurantData) {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurantData),
    });
    if (!res.ok) throw new Error("Failed to update restaurant");
    return await res.json();
  } catch (err) {
    console.error("Error updating restaurant:", err);
    throw err;
  }
}

/* ------------------------------
   DELETE
-------------------------------*/
export async function deleteItem(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete restaurant");
    return await res.json();
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    throw err;
  }
}