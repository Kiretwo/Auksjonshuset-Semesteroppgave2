import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  appType: "mpa",
  base: "/",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./auth/login/index.html"),
        register: resolve(__dirname, "./auth/register/index.html"),
        listingDetail: resolve(__dirname, "./listing/index.html"),
        // Add other pages as needed
      },
    },
  },
  server: {
    open: "/",
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Suppress deprecation warnings from dependencies
      },
    },
  },
});
