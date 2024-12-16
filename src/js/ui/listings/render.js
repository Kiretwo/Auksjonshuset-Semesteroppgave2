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
      const listings = await fetchAllListings();
      allListings = listings;

      // Sort by created date descending
      allListings.sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    const start = (currentPage - 1) * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    const listingsToRender = allListings.slice(start, end);

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

      // Sort bids by amount (highest first) and take the top 3
      const sortedBids = Array.isArray(listing.bids)
        ? listing.bids.sort((a, b) => b.amount - a.amount).slice(0, 3)
        : [];

      // Generate bid content
      const bidsList = sortedBids.length
        ? sortedBids
            .map(
              (bid) =>
                `<div class="bid-item d-flex justify-content-between">
                  <span>${bid.bidder?.name || "Unknown"} bids</span>
                  $${bid.amount}
                </div>`
            )
            .join("")
        : "<div class='bid-item'>No bids yet</div>";

      const innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
          <p class="text-muted mb-0 text-time"><i class="fa-solid fa-clock"></i> ${formattedTime}</p>
        </div>
        <div class="d-flex align-items-start mb-3">
          <img
            src="${
              listing.media?.[0]?.url || "./images/no_image_placeholder.png"
            }"
            alt="${listing.media?.[0]?.alt || "Listing image"}"
            class="listing-img me-3"
          />
          <div class="listing-details flex-grow-1">
            <h5 class="fw-bold text-truncate">${listing.title}</h5>
          </div>
        </div>
        <div class="bids-container mb-3">
          ${bidsList}
        </div>
        <div class="mt-auto d-flex justify-content-between">
          <button class="btn btn-secondary view-listing-btn" onclick="viewListing('${
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

  window.viewListing = function (listingId) {
    // Navigate to the detailed listing page
    window.location.href = `/listing/?id=${listingId}`;
  };
}
