import { fetchListingDetails } from "../../api/listings/read.js";

export async function initListingDetails() {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");
  const container = document.querySelector("#listing-details");

  if (!listingId) {
    container.innerHTML = `<p>Error: Listing not found.</p>`;
    return;
  }

  try {
    const listing = await fetchListingDetails(listingId);

    // Log the listing details for debugging
    console.log("Listing details:", listing);

    // Extract fields
    const title = listing.title || "No Title Available";
    const description = listing.description || "No description available.";
    const endsAt = listing.endsAt
      ? new Date(listing.endsAt).toLocaleString()
      : "N/A";
    const createdAt = listing.created
      ? new Date(listing.created).toLocaleString()
      : "N/A";
    const bidCount = listing._count?.bids || 0;

    // Render media (handle multiple images)
    const mediaContent =
      Array.isArray(listing.media) && listing.media.length > 0
        ? listing.media
            .map(
              (media) =>
                `<img src="${media.url}" alt="${
                  media.alt || "Listing image"
                }" class="img-fluid rounded mb-3" style="max-width: 100%; height: auto;">`
            )
            .join("")
        : `<img src="/images/no_image_placeholder.png" alt="No image available" class="img-fluid rounded mb-3">`;

    // Render listing details
    container.innerHTML = `
      <h1>${title}</h1>
      <div>${mediaContent}</div>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Created At:</strong> ${createdAt}</p>
      <p><strong>Ends At:</strong> ${endsAt}</p>
      <p><strong>Total Bids:</strong> ${bidCount}</p>
    `;
  } catch (error) {
    console.error("Error fetching listing details:", error);
    container.innerHTML =
      "<p>Error loading listing details. Please try again later.</p>";
  }
}
