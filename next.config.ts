import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
        hostname: "upload.wikimedia.org", // Added this line
        port: "",
        pathname: "/**",
      },
      // Add leaflet tile servers
      {
        protocol: "https",
        hostname: "*.tile.openstreetmap.org", // Allows a.tile, b.tile, etc.
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
