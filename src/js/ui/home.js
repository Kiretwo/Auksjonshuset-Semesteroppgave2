import { renderListings } from "./listings/renderListings.js";

export function initHome() {
  console.log("Home module loaded");

  const listingsContainer = "#listings-container";
  const showMoreButton = "#show-more-button";

  // Initial render
  renderListings(listingsContainer, showMoreButton);

  // Add event listener to "Show More" button
  document.querySelector(showMoreButton).addEventListener("click", () => {
    renderListings(listingsContainer, showMoreButton);
  });
}
