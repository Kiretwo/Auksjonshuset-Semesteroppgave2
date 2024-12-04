import { Modal } from "bootstrap";

export function initHeader() {
  const loginButton = document.querySelector('[data-action="login"]');
  const registerButton = document.querySelector('[data-action="register"]');

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      const loginModal = new Modal(
        document.getElementById("loginModal")
      );
      loginModal.show();
    });
  }

  if (registerButton) {
    registerButton.addEventListener("click", () => {
      const registerModal = new Modal(
        document.getElementById("registerModal")
      );
      registerModal.show();
    });
  }
}
