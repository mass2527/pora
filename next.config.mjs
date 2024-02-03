/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "up41ksziipiynuir.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
