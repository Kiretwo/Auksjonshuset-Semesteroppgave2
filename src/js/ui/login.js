console.log("Login module loaded");

export function init() {
  const helloButton = document.getElementById("helloButton");

  if (!helloButton) {
    console.warn("helloButton not found on the page");
    return;
  }

  // Add an event listener to the button
  helloButton.addEventListener("click", () => {
    alert("Hello, World!");
  });
}
