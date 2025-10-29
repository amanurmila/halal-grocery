// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co", "lh3.googleusercontent.com"], // Add your external image domains here
  },
};

// ESM export syntax (not module.exports)
export default nextConfig;
