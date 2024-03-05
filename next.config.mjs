/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/blog/*/article/*":
        "node_modules/.pnpm/node_modules/vscode-oniguruma/release/onig.wasm",
    },
  },
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
