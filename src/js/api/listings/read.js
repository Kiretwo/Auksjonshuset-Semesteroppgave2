import { API_AUCTION_LISTINGS } from "../constants.js";


// Fetch all listings from api
export async function fetchAllListings() {
  try {
    // Request listings sorted by the created field in descending order:
    const response = await fetch(`${API_AUCTION_LISTINGS}?_active=true&sort=created&sortOrder=desc`);
    if (!response.ok) {
      throw new Error("Failed to fetch listings");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Fetch a single listing by its ID
export async function fetchListingDetails(listingId) {
  try {
    const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch listing details");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    throw error;
  }
}

// Fetch a single listing by its ID, including bids
export async function fetchListingBids(listingId) {
  try {
    const response = await fetch(`${API_AUCTION_LISTINGS}/${listingId}?_bids=true`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bids for listing ID: ${listingId}`);
    }
    const data = await response.json();
    console.log("Listing bids:", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching listing bids:", error);
    throw error;
  }
}

export async function fetchSearchResults(query) {
  try {
    const response = await fetch(
      `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const data = await response.json();
    return data.data; // Return the search results
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}

