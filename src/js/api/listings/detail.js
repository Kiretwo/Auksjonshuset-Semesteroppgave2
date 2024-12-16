import { API_AUCTION_LISTINGS } from "../constants";

export async function fetchListingDetails(listingId) {
  const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}?_seller=true`);
  if (!response.ok) {
    throw new Error("Failed to fetch listing details");
  }
  return await response.json();
}
