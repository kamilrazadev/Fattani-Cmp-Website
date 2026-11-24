import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "fattanicomputer.com" },
      { protocol: "https", hostname: "fattanicomputers.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    deviceSizes: [640, 828, 1080, 1600],
    imageSizes: [64, 128, 256, 384],
    qualities: [55, 70, 75, 80, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
  experimental: { optimizePackageImports: ["lucide-react", "@base-ui/react"] },
  async headers() {
    return [
      { source: "/(.*)", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ] },
      { source: "/(brand|clients)/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ]
  },
}

export default nextConfig
