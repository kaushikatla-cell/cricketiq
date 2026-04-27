import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack workspace root so builds do not pick a parent lockfile by mistake.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
