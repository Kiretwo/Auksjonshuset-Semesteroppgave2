export function onLogout() {
  // Remove authentication details from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");

  // Refresh page when logging out
  window.location.reload();
}
