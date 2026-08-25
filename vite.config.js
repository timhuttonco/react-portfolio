import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Resolves a module id like ".../node_modules/@scope/pkg/dist/x.js" down to
// its exact npm package name ("@scope/pkg"). Matching on the clean package
// name (instead of regex-testing the raw path) avoids escaping mistakes and
// false-positive substring matches.
function getPackageName(id) {
  const normalized = id.replace(/\\/g, "/");
  const marker = "/node_modules/";
  const i = normalized.lastIndexOf(marker);
  if (i === -1) return null;
  const rest = normalized.slice(i + marker.length);
  const parts = rest.split("/");
  return parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
}

// react-router + its small runtime dependencies, react-helmet-async + its
// small utility dependencies, and react-scroll + its small utility
// dependencies. Bundling these tiny leaf packages in with the React/router
// code they exclusively belong to (rather than leaving them in the generic
// "vendor" bucket) is what keeps this chunk graph acyclic.
const REACT_VENDOR_PACKAGES = new Set([
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
  "@remix-run/router",
  "history",
  "scheduler",
  "cookie",
  "set-cookie-parser",
  "react-helmet-async",
  "react-fast-compare",
  "invariant",
  "shallowequal",
  "react-scroll",
  "prop-types",
  "lodash.throttle",
  "@babel/runtime",
]);

const UI_VENDOR_PACKAGES = new Set([
  "aos",
  "react-slick",
  "slick-carousel",
  "react-animate-on-scroll",
  "react-typed",
  "fslightbox-react",
  "react-countup",
  "react-on-screen",
  "react-visibility-sensor",
]);

// Groups third-party packages into a handful of named vendor chunks instead
// of one giant bundle, so a visitor only downloads what a given page needs
// (e.g. the markdown/parsing stack used by blog & service detail pages
// doesn't have to be fetched before the homepage can render).
function manualChunks(id) {
  const pkg = getPackageName(id);
  if (!pkg) return;

  if (
    pkg === "react-markdown" ||
    pkg === "gray-matter" ||
    /rehype|remark|unified|micromark|mdast|hast|unist|vfile/.test(pkg)
  ) {
    return "markdown-vendor";
  }

  if (pkg.startsWith("@fortawesome/")) {
    return "fontawesome-vendor";
  }

  if (UI_VENDOR_PACKAGES.has(pkg)) {
    return "ui-vendor";
  }

  if (REACT_VENDOR_PACKAGES.has(pkg)) {
    return "react-vendor";
  }

  return "vendor";
}

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
