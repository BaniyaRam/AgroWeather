import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Farm Weather Dashboard",
        short_name: "FarmWeather",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openweathermap\.org/,
            handler: "NetworkFirst",
            options: {
              cacheName: "weather-cache",
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: /^https:\/\/openweathermap\.org\/img\/wn/,
            handler: "CacheFirst",
            options: { cacheName: "icon-cache" },
          },
        ],
      },
    }),
  ],
  server: {
    open: true,
  },
});
