import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* इसे experimental के बाहर, सीधे रूट लेवल पर रखना है */
  allowedDevOrigins: ['192.168.31.211:3000', '192.168.31.211', 'localhost:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  }
};

export default nextConfig;