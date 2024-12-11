import { fetchAllListings, fetchListingBids } from "../../api/listings/read.js";

const PAGE_LIMIT = 12;
let allListings = [];
let currentPage = 1;

export async function renderListings(
  containerSelector,
  showMoreButtonSelector
) {
  const container = document.querySelector(containerSelector);
  const showMoreButton = document.querySelector(showMoreButtonSelector);

  try {
    if (allListings.length === 0) {
      const response = await fetchAllListings();
      allListings = response.data;
    }

    const start = (currentPage - 1) * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    const listingsToRender = allListings.slice(start, end);

    // Fetch bids for each listing before rendering
    const updatedListings = await Promise.all(
      listingsToRender.map(async (listing) => {
        try {
          const updatedListing = await fetchListingBids(listing.id);
          return updatedListing;
        } catch {
          return listing; // Fall back to original listing if bids fetch fails
        }
      })
    );

    updatedListings.forEach((listing) => {
      const colElement = document.createElement("div");
      colElement.classList.add("col");

      const listingElement = document.createElement("div");
      listingElement.classList.add("card", "p-3", "rounded", "shadow-sm");
      listingElement.setAttribute("data-id", listing.id);

      const endsAtDate = new Date(listing.endsAt);
      const formattedTime = `Ends at: ${endsAtDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      })} ${endsAtDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}`;

      const bidsList = Array.isArray(listing.bids)
        ? listing.bids
            .slice(0, 3)
            .map(
              (bid) =>
                `<li>${bid.username || "Unknown user"} bids <strong>$${
                  bid.amount || 0
                }</strong></li>`
            )
            .join("")
        : "<li>No bids yet</li>";

      const innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
          <p class="text-muted mb-0 text-time"><i class="fa-solid fa-clock"></i> ${formattedTime}</p>
        </div>
        <div class="d-flex align-items-start">
          <img
            src="${
              listing.media?.[0]?.url || "./images/no_image_placeholder.png"
            }"
            alt="${listing.media?.[0]?.alt || "Listing image"}"
            class="listing-img me-3"
            style="width: 37px; height: 37px; object-fit: cover;"
          />
          <div class="listing-details">
            <h5 class="fw-bold text-truncate">${listing.title}</h5>
            <ul class="list-unstyled mb-3">${bidsList}</ul>
          </div>
        </div>
        <div class="mt-3 d-flex justify-content-between">
          <button class="btn btn-success" onclick="bidOnListing('${
            listing.id
          }')">Bid on Listing</button>
          <button class="btn btn-secondary" onclick="viewListing('${
            listing.id
          }')">View Listing</button>
        </div>
      `;

      listingElement.innerHTML = innerHTML;

      colElement.appendChild(listingElement);
      container.appendChild(colElement);
    });

    currentPage++;

    if (end >= allListings.length) {
      showMoreButton.setAttribute("hidden", "true");
    } else {
      showMoreButton.removeAttribute("hidden");
    }
  } catch (error) {
    console.error("Error rendering listings:", error);
  }
}
