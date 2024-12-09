import { Modal } from "bootstrap";
import { loginUser } from "../../api/auth/login.js";

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

    // Log the result and redirect the user to the home page
    console.log("Login successful:", result);
    //window.location.href = "/";

    // Reset the form
    form.reset();

    // Close the modal with a slight delay
    setTimeout(() => {
      const modal = Modal.getInstance(document.querySelector("#loginModal"));
      modal.hide();
    }, 100);
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Login failed. Please check your credentials and try again.");
  }
}
