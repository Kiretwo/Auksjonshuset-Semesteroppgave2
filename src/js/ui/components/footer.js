export function initFooter() {
  const accessToken = localStorage.getItem("accessToken");
  const credits = localStorage.getItem("credits");
  const footerBalance = document.getElementById("footer-balance");
  const footerUserCredits = document.getElementById("footer-user-credits");

  if (footerBalance && footerUserCredits) {
    if (accessToken && credits) {
      // User logged in, show balance in footer on small screens
      footerBalance.classList.remove("d-none");
      footerUserCredits.textContent = `$${credits}`;
    } else {
      // Hide footer balance when not logged in
      footerBalance.classList.add("d-none");
    }
  }
}
