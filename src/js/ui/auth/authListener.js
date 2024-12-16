export function setupAuthListeners() {
  const loginButtons = document.querySelectorAll('[data-action="login"]');
  loginButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const loginModule = await import("./form-handling/login.js");
      loginModule.initLogin();
    });
  });

  const registerButtons = document.querySelectorAll('[data-action="register"]');
  registerButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const registerModule = await import("./form-handling/register.js");
      registerModule.initRegister();
    });
  });
}
