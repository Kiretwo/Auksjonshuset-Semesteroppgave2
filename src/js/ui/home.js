import { renderListings } from "./listings/render.js";

export function initHome() {
  console.log("Home module loaded");

  const listingsContainer = "#listings-container";
  const showMoreButton = "#show-more-button";
  const createButton = "#create-button";

  // Initial render
  renderListings(listingsContainer, showMoreButton);

  // Add event listener to "Show More" button
  document.querySelector(showMoreButton).addEventListener("click", () => {
    renderListings(listingsContainer, showMoreButton);
  });

  // Add event listener to "Create Listing" button
  document.querySelector(createButton).addEventListener("click", () => {
    window.location.href = "./listing/create/";
  });
}
