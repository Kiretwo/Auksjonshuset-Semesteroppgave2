export function setupAuthListeners() {
  const loginButton = document.querySelector('[data-action="login"]');
  const registerButton = document.querySelector('[data-action="register"]');

  if (loginButton) {
    loginButton.addEventListener("click", async () => {
      // Dynamically import login.js when the login button is clicked
      const loginModule = await import("./form-handling/login.js");
      // Call init() to attach the submit listener to #loginForm
      loginModule.initLogin();
    });
  }

  if (registerButton) {
    registerButton.addEventListener("click", async () => {
      // Dynamically import register.js when the register button is clicked
      const registerModule = await import("./form-handling/register.js");
      // Call init() to attach the submit listener to #registerForm
      registerModule.initRegister();
    });
  }
}
