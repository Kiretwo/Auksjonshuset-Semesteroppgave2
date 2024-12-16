import { fetchUserProfile } from "../../api/profile/read.js";
import { updateUserProfile } from "../../api/profile/update.js";

export async function initProfile() {
  const username = localStorage.getItem("username");
  const accessToken = localStorage.getItem("accessToken");

  const profileSection = document.getElementById("profile");
  const listingsSection = document.getElementById("user-listings");
  const updateForm = document.getElementById("updateProfileForm");

  if (!username || !accessToken) {
    // User not logged in, show a message
    profileSection.innerHTML = "<p>Please log in to view your profile.</p>";
    return;
  }

  try {
    // Fetch the user profile with listings
    const profile = await fetchUserProfile(username + "?_listings=true");
    renderProfile(profile);
    renderListings(profile.listings || []);
  } catch (error) {
    console.error("Error fetching profile:", error);
    profileSection.innerHTML =
      "<p>Failed to load profile. Please try again later.</p>";
  }

  if (updateForm) {
    updateForm.addEventListener("submit", handleProfileUpdate);
  }

  async function handleProfileUpdate(event) {
    event.preventDefault();

    const bio = document.getElementById("profileBio").value.trim();
    const avatarUrl = document.getElementById("profileAvatarUrl").value.trim();
    const bannerUrl = document.getElementById("profileBannerUrl").value.trim();

    const profileData = {};
    if (bio) profileData.bio = bio;
    if (avatarUrl) profileData.avatar = { url: avatarUrl, alt: "" };
    if (bannerUrl) profileData.banner = { url: bannerUrl, alt: "" };

    if (Object.keys(profileData).length === 0) {
      alert("Please enter at least one field to update.");
      return;
    }

    try {
      const updatedProfile = await updateUserProfile(username, profileData);
      alert("Profile updated successfully!");
      renderProfile(updatedProfile);
      event.target.reset();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  }

  function renderProfile(profile) {
    profileSection.innerHTML = `
      <div class="card bg-dark text-light p-4 mb-4">
        <div class="d-flex align-items-center mb-3">
          <img src="${
            profile.avatar?.url || "/images/no_image_placeholder.png"
          }" 
            alt="${profile.avatar?.alt || "User Avatar"}" 
            class="rounded-circle me-3" 
            style="width:60px; height:60px; object-fit:cover;">
          <h2 class="mb-0">${profile.name}</h2>
        </div>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Bio:</strong> ${profile.bio || "No bio set"}</p>
        <p><strong>Credits:</strong> ${profile.credits}</p>
      </div>
    `;
  }

  function renderListings(listings) {
    if (listings.length === 0) {
      listingsSection.innerHTML =
        "<p class='text-muted'>No listings found for this user.</p>";
      return;
    }

    listingsSection.innerHTML = listings
      .map((listing) => {
        const imageUrl =
          listing.media?.[0]?.url || "./images/no_image_placeholder.png";
        return `
        <div class="col">
          <div class="card bg-dark text-light p-3 rounded shadow-sm h-100">
            <div class="d-flex align-items-start mb-2">
              <img src="${imageUrl}" 
                alt="${listing.media?.[0]?.alt || "Listing image"}" 
                  class="listing-img me-3" 
                  style="width:50px; height:50px; object-fit:cover;">
              <h5 class="fw-bold text-truncate">${listing.title}</h5>
            </div>
            <p>${listing.description || ""}</p>
            <p class="text-muted"><small>Ends at: ${new Date(
              listing.endsAt
            ).toLocaleString()}</small></p>
            <a href="/listing/?id=${
              listing.id
            }" class="btn btn-secondary mt-auto">View Listing</a>
          </div>
        </div>
      `;
      })
      .join("");
  }
}
