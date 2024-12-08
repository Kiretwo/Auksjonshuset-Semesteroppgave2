import { API_KEY } from "./constants";

export function headers() {
  const headers = new Headers();

  // Set the API key
  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  // Set the access token if it exists in localStorage
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  // Set the content type to JSON for API requests
  headers.append("Content-Type", "application/json");

  return headers;
}
