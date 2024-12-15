import { onLogout } from "../auth/onLogout.js";

export function setLogoutListener() {
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", onLogout);
  }
}
