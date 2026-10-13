import type { NextConfig } from "next";

// GitHub Pages serves static files only: export the site when building for Pages.
const isPagesBuild = process.env.BUILD_TARGET === "pages";

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: "export",
      basePath: "/laptop-performance-optimization-hub",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
