import { Offcanvas } from "bootstrap";

export function initSidebar() {
  const offcanvasToggleButton = document.querySelector(
    '[data-action="toggle-sidebar"]'
  );
  if (offcanvasToggleButton) {
    offcanvasToggleButton.addEventListener("click", () => {
      const offcanvasElement = document.getElementById("offcanvasSidebar");
      const offcanvasInstance = new Offcanvas(offcanvasElement);
      offcanvasInstance.toggle();
    });
  }
}
