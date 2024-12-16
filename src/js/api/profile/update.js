import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";

export async function updateUserProfile(username, profileData) {
  if (!username) {
    throw new Error("Username is required to update profile.");
  }

  // Ensure that at least one property is provided
  if (!profileData || Object.keys(profileData).length === 0) {
    throw new Error(
      "At least one field (bio, avatar, banner) must be provided to update the profile."
    );
  }

  const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || "Failed to update profile"
    );
  }

  const { data } = await response.json();
  return data;
}
