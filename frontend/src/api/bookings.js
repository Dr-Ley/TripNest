const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Fetch all bookings
 */
export async function fetchBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error("Failed to create booking");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

/**
 * Update a booking
 */
export async function updateBooking(id, bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error("Failed to update booking");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete booking");
    return await response.json();
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
}
