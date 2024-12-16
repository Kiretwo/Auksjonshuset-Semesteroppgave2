import { createListing } from "../../api/listings/create.js";

export function initCreateListing() {
  const form = document.getElementById("createListingForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("listingTitle").value.trim();
    const description = document
      .getElementById("listingDescription")
      .value.trim();
    const tagsInput = document.getElementById("listingTags").value.trim();
    const media1 = document.getElementById("listingMedia1").value.trim();
    const media2 = document.getElementById("listingMedia2").value.trim();
    const media3 = document.getElementById("listingMedia3").value.trim();
    const endsAt = document.getElementById("listingEndsAt").value; // datetime-local value

    if (!title || !endsAt) {
      alert("Please fill in all required fields.");
      return;
    }

    const tags = tagsInput ? tagsInput.split(",").map((tag) => tag.trim()) : [];
    // Include only non-empty media URLs
    const media = [media1, media2, media3].filter((url) => url !== "");

    try {
      const newListing = await createListing({
        title,
        description,
        tags,
        media,
        endsAt,
      });
      alert("Listing created successfully!");

      // Redirect to the newly created listing detail page
      window.location.href = `/listing/?id=${newListing.id}`;
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Error creating listing. Please try again.");
    }
  });
}
