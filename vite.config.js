import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/js/pages/login/index.html"),
        register: resolve(__dirname, "src/js/pages/register/index.html"),
        profile: resolve(__dirname, "src/js/pages/profile/index.html"),
        createListing: resolve(__dirname, "src/js/pages/create-listing/index.html"),
        // Add other pages as needed
      },
    },
  },
  server: {
    open: "/",
  },
});
