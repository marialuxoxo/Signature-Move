import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Im Entwicklungsmodus laufen Oberfläche (Vite, Port 5173) und API (Express, Port 8787)
// getrennt. Anfragen an /api werden an den API-Server weitergereicht.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${process.env.PORT ?? 8787}`,
    },
  },
  test: {
    environment: "node",
  },
});
