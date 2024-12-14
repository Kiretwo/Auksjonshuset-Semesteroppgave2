import { fetchSearchResults } from "../../api/listings/read.js";
import { renderListings } from "../listings/render.js";

export function initSearch() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Show dynamic results as the user types
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.style.display = "none";
      searchResults.innerHTML = "";
      return;
    }

    try {
      const results = await fetchSearchResults(query);

      if (results.length > 0) {
        searchResults.innerHTML = `
          <div class="search-results-header">Results:</div>
          ${results
            .map(
              (result) =>
                `<div class="p-2 search-result-item d-flex align-items-center" data-id="${
                  result.id
                }">
                  <img
                    src="${
                      result.media?.[0]?.url ||
                      "/images/no_image_placeholder.png"
                    }"
                    alt="${result.media?.[0]?.alt || "Listing image"}"
                    class="rounded me-2"
                    style="width: 40px; height: 40px; object-fit: cover;"
                  />
                  <strong>${result.title}</strong>
                </div>`
            )
            .join("")}
        `;
        searchResults.style.display = "block";
      } else {
        searchResults.innerHTML = `
          <div class="p-2 text-muted">No results found</div>
        `;
        searchResults.style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  });

  // Handle form submission to update main content area
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      try {
        const results = await fetchSearchResults(query);

        // Update the main content area with search results
        const container = document.querySelector("#listings-container");
        container.innerHTML = ""; // Clear current listings
        results.forEach((listing) => {
          renderListings("#listings-container", listing);
        });

        // Hide search suggestions after submission
        searchResults.style.display = "none";
      } catch (error) {
        console.error("Error rendering search results:", error);
      }
    }
  });

  // Handle result click to navigate to the detail page
  searchResults.addEventListener("click", (event) => {
    if (event.target.closest(".search-result-item")) {
      const listingId = event.target.closest(".search-result-item").dataset.id;
      searchInput.value = ""; // Clear the input
      searchResults.style.display = "none"; // Hide dropdown
      window.location.href = `/listing/index.html?id=${listingId}`; // Navigate to detail page
    }
  });
}
