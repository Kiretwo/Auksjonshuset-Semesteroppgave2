import { fetchListingDetails, fetchListingBids, } from "../../api/listings/read.js";
import { placeBid, fetchProfile } from "../../api/listings/bid.js";
import { deleteListing } from "../../api/listings/delete.js";

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

    // Extract fields
    const title = listing.title || "No Title Available";
    const description = listing.description || "No description available.";
    const endsAtDate = new Date(listing.endsAt);
    const now = new Date();

    // Determine what to display for time
    let timeDisplay;
    if (endsAtDate < now) {
      timeDisplay = "Ended";
    } else {
      timeDisplay = `Ends at: ${endsAtDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      })} ${endsAtDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}`;
    }

    const createdAt = listing.created
      ? new Date(listing.created).toLocaleString()
      : "N/A";
    const bidCount = listing._count?.bids || 0;

    // Generate Bootstrap carousel for media
    const mediaContent =
      Array.isArray(listing.media) && listing.media.length > 0
        ? `
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            ${listing.media
              .map(
                (_, index) =>
                  `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${
                    index === 0 ? "active" : ""
                  }" aria-current="true" aria-label="Slide ${
                    index + 1
                  }"></button>`
              )
              .join("")}
          </div>
          <div class="carousel-inner">
            ${listing.media
              .map(
                (media, index) =>
                  `<div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img 
                      src="${media.url}" 
                      class="d-block w-100 img-contain" 
                      alt="${media.alt || "Listing image"}">
                  </div>`
              )
              .join("")}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        `
        : `<img src="/images/no_image_placeholder.png" alt="No image available" class="img-fluid rounded mb-3">`;

    // Determine if current user is seller
    let isSeller = false;
    const accessToken = localStorage.getItem("accessToken");
    let userProfile = null;
    if (accessToken) {
      try {
        userProfile = await fetchProfile();
        if (listing.seller && listing.seller.name === userProfile.name) {
          isSeller = true;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    // Render listing details
    container.innerHTML = `
      <div class="row mt-4">
        <!-- Carousel Section -->
        <div class="col-lg-8 mb-4">
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div class="d-flex">
              <img
                src="${
                  listing.media?.[0]?.url || "/images/no_image_placeholder.png"
                }"
                alt="${listing.media?.[0]?.alt || "Listing image"}"
                class="listing-img me-3"
                style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"
              />
              <h2 class="mb-0 text-truncate">${title}</h2>
            </div>
            <p class="mb-0 text-time"><i class="fa-solid fa-clock"></i> ${timeDisplay}</p>
          </div>
          <div class="mb-4">${mediaContent}</div>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Created At:</strong> ${createdAt}</p>
        </div>

        <!-- Bid Section -->
        <div class="col-lg-4 mb-2">
          <div class="bid-card card p-4 shadow-sm">
            <h2>Place Your Bid</h2>
            <form id="bidForm">
              <div class="mb-3">
                <label for="bidAmount" class="form-label">Bid Amount</label>
                <input
                  type="number"
                  class="form-control"
                  id="bidAmount"
                  placeholder="Enter your bid"
                  min="1"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success w-100">Place Bid</button>
            </form>
            ${
              // If the user is the seller, show the "Delete Listing" button
              isSeller
                ? `<button id="deleteListingBtn" class="btn btn-danger w-100 mt-3">Delete Listing</button>`
                : ``
            }
          </div>
        </div>
      </div>

      <!-- Recent Bids Section -->
      <div class="row recent-bids">
        <div class="col-lg-8">
          <div class="card p-4 shadow-sm">
            <h2>Recent Bids</h2>
            <p><strong>Total Bids:</strong> <span id="bidCount">${bidCount}</span></p>
            <div id="recentBids" class="overflow-auto" style="max-height: 200px; min-height: 125px;">
              <p>Loading recent bids...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize real-time bid updates
    await updateBids(listingId);
    setInterval(() => updateBids(listingId), 300000); // Update every 5 minutes

    // Add event listener to the bid form
    const bidForm = document.querySelector("#bidForm");
    bidForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleBidSubmission(listingId);
    });

    // If user is seller, add listener to delete button
    if (isSeller) {
      const deleteBtn = document.getElementById("deleteListingBtn");
      deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this listing?"
        );
        if (confirmDelete) {
          try {
            await deleteListing(listingId);
            alert("Listing deleted successfully!");
            window.location.href = "/";
          } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete the listing. Please try again.");
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching listing details:", error);
    container.innerHTML =
      "<p>Error loading listing details. Please try again later.</p>";
  }
}

async function updateBids(listingId) {
  try {
    const recentBidsContainer = document.querySelector("#recentBids");
    const bidCountElement = document.querySelector("#bidCount");

    // Fetch recent bids
    const listing = await fetchListingBids(listingId);
    const bids = listing.bids || [];

    // Update total bids count
    bidCountElement.textContent = bids.length;

    // Sort bids by amount (highest first)
    const sortedBids = bids.sort((a, b) => b.amount - a.amount);

    // Render all bids
    recentBidsContainer.innerHTML = sortedBids
      .map(
        (bid) =>
          `<div class="d-flex justify-content-between mb-2">
            <span><strong>${bid.bidder?.name || "Unknown"}</strong> bids</span>
            <strong class="me-3">$${bid.amount}</strong>
          </div>`
      )
      .join("");

    return sortedBids;
  } catch (error) {
    console.error("Error updating bids:", error);
  }
}

async function handleBidSubmission(listingId) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    alert("You must be logged in to place a bid.");
    return;
  }

  const bidInput = document.querySelector("#bidAmount");
  const bidAmount = parseInt(bidInput.value, 10);
  if (isNaN(bidAmount) || bidAmount <= 0) {
    alert("Please enter a valid bid amount.");
    return;
  }

  // Fetch listing details to check seller and current highest bid
  const listing = await fetchListingBids(listingId);
  const bids = listing.bids || [];
  const highestBid =
    bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : 0;

  // Check user profile
  let userProfile;
  try {
    userProfile = await fetchProfile();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    alert("Failed to verify your credits. Please try again.");
    return;
  }

  if (!userProfile) {
    alert("You must be logged in to place a bid.");
    return;
  }

  // If the logged-in user is the seller of this listing, show alert and return
  if (listing.seller && listing.seller.name === userProfile.name) {
    alert("You cannot bid on your own listing.");
    return;
  }

  // Check bid amount vs highest bid
  if (bidAmount <= highestBid) {
    alert(
      `Your bid must be higher than the current highest bid of $${highestBid}.`
    );
    return;
  }

  // Check user's credits
  const userCredits = userProfile.credits;
  if (bidAmount > userCredits) {
    alert(
      `You don't have enough credits. You have $${userCredits}, but tried to bid $${bidAmount}.`
    );
    return;
  }

  // Place the bid via the API
  try {
    await placeBid(listingId, bidAmount);
    // Update the bids list
    await updateBids(listingId);
    alert("Your bid has been placed successfully!");
    bidInput.value = "";

    // Fetch updated profile after successful bid
    const updatedProfile = await fetchProfile();
    if (updatedProfile) {
      // Update localStorage with new credits
      localStorage.setItem("credits", updatedProfile.credits);

      // Update UI elements showing credits if they exist
      const headerCredits = document.getElementById("user-credits");
      if (headerCredits) {
        headerCredits.textContent = `$${updatedProfile.credits}`;
      }

      const footerUserCredits = document.getElementById("footer-user-credits");
      if (footerUserCredits) {
        footerUserCredits.textContent = `$${updatedProfile.credits}`;
      }

      const sidebarUserCredits = document.getElementById(
        "sidebar-user-credits"
      );
      if (sidebarUserCredits) {
        sidebarUserCredits.textContent = `$${updatedProfile.credits}`;
      }
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("Error placing your bid. Please try again.");
  }
}
