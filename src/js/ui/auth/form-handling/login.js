import { onLogin } from "../onLogin.js";

export function initLogin() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", onLogin);
  }
}
