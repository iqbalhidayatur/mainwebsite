import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        journey: resolve(process.cwd(), "journey.html"),
      },
    },
  },
});
