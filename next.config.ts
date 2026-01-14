import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // make the frontend folder the Turbopack root to silence the "inferred workspace root" warning
    // use an absolute path to avoid Turbopack errors about relative paths
    root: path.resolve(__dirname),
  },
  /* config options here */
};

export default nextConfig;
