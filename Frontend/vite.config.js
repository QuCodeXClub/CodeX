import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "@reduxjs/toolkit",
      "react-redux",
      "tinymce",
      "@tinymce/tinymce-react"
    ]
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");

          if (normalizedId.includes("node_modules/")) {
            if (
              normalizedId.includes("/react/") ||
              normalizedId.includes("/react-dom/") ||
              normalizedId.includes("/react-router/") ||
              normalizedId.includes("/react-router-dom/") ||
              normalizedId.includes("/@remix-run/") ||
              normalizedId.includes("/scheduler/")
            ) {
              return "vendor-react";
            }
            if (normalizedId.includes("/@reduxjs/") || normalizedId.includes("/react-redux/")) {
              return "vendor-redux";
            }
            if (normalizedId.includes("/lucide-react/")) {
              return "vendor-icons";
            }
            if (
              normalizedId.includes("/jspdf/") ||
              normalizedId.includes("/html2canvas/") ||
              normalizedId.includes("/dompurify/")
            ) {
              return "vendor-pdf";
            }
            if (normalizedId.includes("/tinymce/") || normalizedId.includes("/@tinymce/")) {
              return "vendor-editor";
            }
          }

          if (normalizedId.includes("/src/pages/admin/") || normalizedId.includes("/src/components/admin/")) {
            return "admin-suite";
          }

          if (
            normalizedId.includes("/src/pages/PrivacyPolicy") ||
            normalizedId.includes("/src/pages/TermsConditions") ||
            normalizedId.includes("/src/pages/CommunityGuidelines") ||
            normalizedId.includes("/src/pages/EventPolicy") ||
            normalizedId.includes("/src/pages/Accessibility") ||
            normalizedId.includes("/src/pages/PaymentRegistrationGuide") ||
            normalizedId.includes("/src/data/legal.json")
          ) {
            return "legal-pages";
          }
        },
      },
    },
  },
});
