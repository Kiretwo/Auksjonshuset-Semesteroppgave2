import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

export async function fetchUserProfile(username) {
  if (!username) {
    throw new Error("Username is required to fetch profile.");
  }

  const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const { data } = await response.json();
  // data includes: name, email, bio, avatar, banner, credits, etc.
  return data;
}
