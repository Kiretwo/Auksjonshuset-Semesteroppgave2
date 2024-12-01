import "./scss/main.scss";

function getCurrentPage() {
  // Retrieves the value of the 'data-page' attribute from the <body> tag
  return document.body.getAttribute("data-page");
}

async function init() {
  const page = getCurrentPage();

  try {
    switch (page) {
      case "home":
        const homeModule = await import("./js/ui/home.js");
        homeModule.init();
        break;
      case "login":
        const loginModule = await import("./js/ui/login.js");
        loginModule.init();
        break;
      case "register":
        const registerModule = await import("./js/ui/register.js");
        registerModule.init();
        break;
      /*  
      case "profile":
        const profileModule = await import("./ui/profile/profile.js");
        profileModule.init();
        break;
      case "create-listing":
        const createListingModule = await import("./ui/create-listing/create-listing.js");
        createListingModule.init();
        break;
      case "edit-listing":
        const editListingModule = await import("./ui/edit-listing/edit-listing.js");
        editListingModule.init();
        break;
      case "delete-listing":
        const deleteListingModule = await import("./ui/delete-listing/delete-listing.js");
        deleteListingModule.init();
        break;
      */
      default:
        console.warn(`No module found for page: ${page}`);
    }
  } catch (error) {
    console.error("Error loading page module:", error);
  }
}

// Initialize the application
init();
