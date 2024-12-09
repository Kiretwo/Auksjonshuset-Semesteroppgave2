import { fetchAllListings } from "../../api/listings/read.js";

const PAGE_LIMIT = 12;
let allListings = [];
let currentPage = 1;

export async function renderListings(
  containerSelector,
  showMoreButtonSelector
) {
  const container = document.querySelector(containerSelector);
  const showMoreButton = document.querySelector(showMoreButtonSelector);
  console.log(showMoreButton);

  try {
    // Fetch all listings once if not already fetched
    if (allListings.length === 0) {
      const response = await fetchAllListings();
      allListings = response.data;
    }

    // Calculate the listings to render for the current page
    const start = (currentPage - 1) * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    const listingsToRender = allListings.slice(start, end);

    // Render each listing
    listingsToRender.forEach((listing) => {
      const listingElement = document.createElement("div");
      listingElement.classList.add("card", "mb-3");

      // Build the HTML for the listing
      let innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${listing.title}</h5>
          <p class="card-text">${
            listing.description || "No description provided."
          }</p>
          <p class="card-text"><small class="text-muted">Ends at: ${new Date(
            listing.endsAt
          ).toLocaleDateString()}</small></p>
        </div>
      `;

      // Include an image if available
      if (listing.media && listing.media[0] && listing.media[0].url) {
        innerHTML =
          `
          <img src="${listing.media[0].url}" class="card-img-top" alt="${
            listing.media[0].alt || "Listing image"
          }">
        ` + innerHTML;
      } else {
        innerHTML =
          `
          <img src="./images/no_image_placeholder.png" class="card-img-top" alt="No image available">
        ` + innerHTML;
      }

      listingElement.innerHTML = innerHTML;
      container.appendChild(listingElement);
    });

    // Increment the current page
    currentPage++;

    // Hide the "Show More" button if all listings have been rendered
    if (end >= allListings.length) {
      //console.log("All listings displayed. Hiding the button");
      showMoreButton.setAttribute("hidden", "true");
      //showMoreButton.style.display = "none";
    } else {
      //console.log("More listings available. Showing the button");
      showMoreButton.removeAttribute("hidden");
      //showMoreButton.style.display = "block";
    }
  } catch (error) {
    console.error("Error rendering listings:", error);
  }
}
