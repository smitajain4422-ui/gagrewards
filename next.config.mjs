/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
      },
      {
        protocol: "https",
        hostname: "bloxtweaks.com",
      },
    ],
  },
}

export default nextConfig
