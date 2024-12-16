import { Modal } from "bootstrap";
import { fetchUserProfile } from "../../api/profile/read.js";

export async function initHeader() {
  const loginButtons = document.querySelectorAll('[data-action="login"]');
  const registerButtons = document.querySelectorAll('[data-action="register"]');
  const loginModalElement = document.getElementById("loginModal");
  const registerModalElement = document.getElementById("registerModal");

  const loginModal = new Modal(loginModalElement);
  const registerModal = new Modal(registerModalElement);

  if (loginButtons.length > 0) {
    loginButtons.forEach((loginButton) => {
      loginButton.addEventListener("click", () => {
        loginModal.show();
      });
    });
  }

  if (registerButtons.length > 0) {
    registerButtons.forEach((registerButton) => {
      registerButton.addEventListener("click", () => {
        registerModal.show();
      });
    });
  }

  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  const loginBtnHeader = document.querySelector(".header-login-btn");
  const registerBtnHeader = document.querySelector(".header-register-btn");
  const userInfo = document.getElementById("user-info");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");
  const userCredits = document.getElementById("user-credits");

  const sidebarProfile = document.getElementById("sidebar-profile");
  const sidebarUserAvatar = document.getElementById("sidebar-user-avatar");
  const sidebarUserName = document.getElementById("sidebar-user-name");
  const sidebarUserCredits = document.getElementById("sidebar-user-credits");

  const sidebarLoginContainer = document.getElementById(
    "sidebar-login-btn-container"
  );
  const sidebarRegisterContainer = document.getElementById(
    "sidebar-register-btn-container"
  );
  const sidebarLogoutContainer = document.getElementById(
    "sidebar-logout-container"
  );

  if (accessToken && username) {
    try {
      const profile = await fetchUserProfile(username);
      if (profile.avatar?.url)
        localStorage.setItem("avatar", profile.avatar.url);
      if (profile.credits != null)
        localStorage.setItem("credits", profile.credits);

      const avatarUrl = localStorage.getItem("avatar");
      const credits = localStorage.getItem("credits");

      // Hide login/register buttons
      if (loginBtnHeader) loginBtnHeader.classList.add("d-none");
      if (registerBtnHeader) registerBtnHeader.classList.add("d-none");

      // Show user info only when logged in
      if (userInfo) {
        userInfo.classList.remove("d-none");
        // Now that user is logged in, allow it to be flex on large screens
        userInfo.classList.add("d-lg-flex");

        if (avatarUrl) userAvatar.src = avatarUrl;
        if (username) userName.textContent = username;
        if (credits) userCredits.textContent = `$${credits}`;
      }

      if (sidebarProfile) {
        sidebarProfile.classList.remove("d-none");
        if (avatarUrl) sidebarUserAvatar.src = avatarUrl;
        if (username) sidebarUserName.textContent = username;
        if (credits) sidebarUserCredits.textContent = `$${credits}`;
      }

      if (sidebarLoginContainer) sidebarLoginContainer.classList.add("d-none");
      if (sidebarRegisterContainer)
        sidebarRegisterContainer.classList.add("d-none");
      if (sidebarLogoutContainer)
        sidebarLogoutContainer.classList.remove("d-none");
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Handle error case if needed
    }

    // Create button logic
    const createBtn = document.getElementById("create-button");
    if (createBtn) {
      createBtn.classList.remove("d-none");
    }
  } else {
    // Not logged in
    if (userInfo) {
      userInfo.classList.add("d-none");
      userInfo.classList.remove("d-lg-flex");
    }
    if (sidebarProfile) sidebarProfile.classList.add("d-none");
    if (sidebarLogoutContainer) sidebarLogoutContainer.classList.add("d-none");

    // Show login/register in sidebar
    if (sidebarLoginContainer) sidebarLoginContainer.classList.remove("d-none");
    if (sidebarRegisterContainer)
      sidebarRegisterContainer.classList.remove("d-none");

    // Hide create button
    const createBtn = document.getElementById("create-button");
    if (createBtn) {
      createBtn.classList.add("d-none");
    }
  }
}
