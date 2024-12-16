import { headers } from "../headers.js";
import { API_AUCTION_LISTINGS } from "../constants.js";

export async function deleteListing(listingId) {
  const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}`, {
    method: "DELETE",
    headers: headers(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || "Failed to delete listing"
    );
  }
}
