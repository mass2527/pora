/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "project-pora.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
