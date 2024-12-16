import { onLogout } from "../auth/onLogout.js";

export function setLogoutListener() {
  const logoutButtons = document.querySelectorAll(".logout-btn");
  logoutButtons.forEach(button => {
    button.addEventListener("click", onLogout);
  });
}
