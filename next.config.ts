import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A lockfile in the parent folder makes Turbopack guess the wrong root.
  turbopack: { root: import.meta.dirname },
  images: {
    // Memory photos ship as static assets; these formats keep them light on mobile.
    formats: ["image/avif", "image/webp"],
  },
  // Deploying to a plain static host (GitHub Pages, S3, Netlify drop)?
  // Uncomment the next line and `next build` will emit a self-contained `out/`.
  // output: "export",
};

export default nextConfig;
