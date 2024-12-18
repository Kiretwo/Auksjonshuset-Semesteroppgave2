import "bootstrap";
import "./scss/main.scss";
import { initHeader } from "./js/ui/components/header.js";
import { initFooter } from "./js/ui/components/footer.js";
import { initSidebar } from "./js/ui/components/sidebar.js";
import { initSearch } from "./js/ui/components/search.js";
import { setupAuthListeners } from "./js/ui/auth/authListener.js";
import { setLogoutListener } from "./js/ui/global/logout.js";

function getCurrentPage() {
  // Retrieves the value of the 'data-page' attribute from the <body> tag
  return document.body.getAttribute("data-page");
}

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const page = getCurrentPage();

  try {
    setupAuthListeners();
    setLogoutListener();
    initHeader();
    initFooter();
    initSidebar();
    initSearch();

    switch (page) {
      case "home":
        const homeModule = await import("./js/ui/home.js");
        homeModule.initHome();
        break;
      case "listing-detail":
        const listingDetailsModule = await import("./js/ui/listings/detail.js");
        listingDetailsModule.initListingDetails();
        break;
      case "create-listing":
        const createListingModule = await import("./js/ui/listings/create.js");
        createListingModule.initCreateListing();
        break;
      case "profile":
        const profileModule = await import("./js/ui/profile/display.js");
        profileModule.initProfile();
        break;
      default:
        console.warn(`No module found for page: ${page}`);
    }
  } catch (error) {
    console.error("Error loading page module:", error);
  }
}