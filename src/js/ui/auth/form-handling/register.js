import { onRegister } from "../onRegister";

export function initRegister() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
}