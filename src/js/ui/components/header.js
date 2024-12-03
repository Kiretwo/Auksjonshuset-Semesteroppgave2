export function initHeader() {
  document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(
      '[data-bs-target="#loginModal"]'
    );
    const registerButton = document.querySelector(
      '[data-bs-target="#registerModal"]'
    );

    if (loginButton) {
      loginButton.addEventListener("click", () => {
        const loginModal = new bootstrap.Modal(
          document.getElementById("loginModal")
        );
        loginModal.show();
      });
    }

    if (registerButton) {
      registerButton.addEventListener("click", () => {
        const registerModal = new bootstrap.Modal(
          document.getElementById("registerModal")
        );
        registerModal.show();
      });
    }
  });
}
