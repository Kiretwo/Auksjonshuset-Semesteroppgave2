import { Modal } from "bootstrap";
import { loginUser } from "../../api/auth/login.js";
import { fetchUserProfile } from "../../api/profile/read.js";

export async function onLogin(event) {
  // Prevent the form from submitting the default way
  event.preventDefault();

  // Get form data
  const form = event.target;
  const email = form.querySelector("#loginEmail").value;
  const password = form.querySelector("#loginPassword").value;

  const userData = { email, password };

  try {
    // Call the API to login the user
    const result = await loginUser(userData);
    console.log("Login successful:", result);

    // Fetch the user's profile to get the credits
    const username = localStorage.getItem("username");
    if (username) {
      const profile = await fetchUserProfile(username);
      if (profile && profile.credits != null) {
        localStorage.setItem("credits", profile.credits);
      }
    }

    // Reload the page after credits are stored
    window.location.reload();

    // Reset the form
    form.reset();

    // Close the modal with a slight delay
    setTimeout(() => {
      const modal = Modal.getInstance(document.querySelector("#loginModal"));
      if (modal) modal.hide();
    }, 100);
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Login failed. Please check your credentials and try again.");
  }
}
