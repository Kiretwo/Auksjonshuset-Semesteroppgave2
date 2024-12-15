import { API_AUCTION_LISTINGS, API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

export async function fetchProfile() {
  const token = localStorage.getItem("accessToken");
  const currentUserName = localStorage.getItem("username");

  if (!token || !currentUserName) {
    // User not logged in or missing user info
    return null;
  }

  const profileUrl = `${API_AUCTION_PROFILES}/${currentUserName}`;
  const response = await fetch(profileUrl, {
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const { data } = await response.json();
  return data; // data contains "credits" among other fields
}

export async function placeBid(listingId, amount) {
  const url = `${API_AUCTION_LISTINGS}/${listingId}/bids`;
  const response = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to place bid");
  }

  const { data } = await response.json();
  return data;
}
