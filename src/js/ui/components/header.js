// header.js
import { Modal } from "bootstrap";

export function initHeader() {
  const loginButtons = document.querySelectorAll('[data-action="login"]');
  const registerButtons = document.querySelectorAll('[data-action="register"]');
  const loginModalElement = document.getElementById("loginModal");
  const registerModalElement = document.getElementById("registerModal");

  // Initialize the modals once
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
}
