import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  
  // Ensure .css files are handled
  css: {
    modules: {
      localsConvention: "camelCase" as const,
    },
  },

  // Alias for src directory
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // Ensure environment variables are handled
  envPrefix: ["VITE_", "TAURI_"],
}));