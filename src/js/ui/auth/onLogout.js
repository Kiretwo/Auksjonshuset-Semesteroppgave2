export function onLogout() {
  // Remove authentication details from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  localStorage.removeItem("credits");
  localStorage.removeItem("avatar");

  // Refresh page when logging out
  window.location.reload();
}
