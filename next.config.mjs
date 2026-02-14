/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "*.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "*.newsapi.org", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
}

export default nextConfig
