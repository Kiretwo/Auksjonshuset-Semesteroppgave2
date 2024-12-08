import { API_AUTH_LOGIN, API_KEY } from "../constants";

export async function loginUser(userData) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    const data = await response.json();

    // Save accessToken and username in localStorage
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("username", data.data.name);

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
