import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Build Optimizations */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* Images Remote Whitelisting */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
      // ✅ OpenStreetMap Dynamic Tile Subdomains Fix
      {
        protocol: "https",
        hostname: "**.tile.openstreetmap.org", // Handles a.tile, b.tile, c.tile recursively
        port: "",
        pathname: "/**",
      },
      // ✅ Firebase Storage (For dynamic image uploads in FixIt)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  /* ✅ Webpack Memory Protection Config (Brings down compilation RAM usage) */
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.cache = {
        type: 'memory',
        maxGenerations: 1, // Purani unused compiler cache ko turant clean karne ke liye
      };
    }
    return config;
  },
};

export default nextConfig;