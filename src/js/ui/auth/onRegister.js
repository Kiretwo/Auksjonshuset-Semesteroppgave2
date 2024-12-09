import { Modal } from "bootstrap";
import { registerUser } from "../../api/auth/register.js";

export async function onRegister(event) {
  // Prevent the form from submitting the default way
  event.preventDefault();

  // Get form data
  const form = event.target;
  const name = form.querySelector("#registerName").value;
  const email = form.querySelector("#registerEmail").value;
  const password = form.querySelector("#registerPassword").value;
  const confirmPassword = form.querySelector("#registerConfirmPassword").value;

  // Check if email contains @stud.noroff.no
  const emailPattern = /^[\w\-.]+@(stud\.)?noroff\.no$/; // Regex for valid email format
  if (!emailPattern.test(email)) {
    alert(
      "Email must be a valid Noroff email address (e.g., example@stud.noroff.no)."
    );
    return; // Stop further execution
  }

  // Check if password is at least 8 characters long
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return; // Stop further execution
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return; // Stop further execution
  }

  const userData = {
    name,
    email,
    password,
  };

  console.log("User data being sent:", userData); // Debug log

  try {
    // Call the API to register the user
    const result = await registerUser(userData);
    console.log("Registration successful:", result);

    // Show a success message
    alert("Registration successful. Please login to continue.");

    // Reset the form
    form.reset();
    
    // Close the modal with a slight delay
    setTimeout(() => {
      const modal = Modal.getInstance(document.querySelector("#registerModal"));
      modal.hide();
    }, 100);

  } catch (error) {
    console.error("Error registering user:", error);
    alert(
      "Registration failed. User might be taken already. Please try again with different information."
    );
  }
}
