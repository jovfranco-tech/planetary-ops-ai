import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,jpg,jpeg,webp}"],
        maximumFileSizeToCacheInBytes: 6000000, // 6MB for some 3D assets
      },
      manifest: {
        name: "Planetary Operations AI",
        short_name: "PlanetaryOps",
        description: "AI Command Center with offline capability",
        theme_color: "#04060d",
        background_color: "#04060d",
        display: "standalone",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
          }
        ]
      }
    })
  ],
});
