import { API_AUCTION_LISTINGS } from "../../api/constants.js";

export async function fetchAllListings() {
  try {
    const response = await fetch(`${API_AUCTION_LISTINGS}?_active=true`);
    if (!response.ok) {
      throw new Error("Failed to fetch listings");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
