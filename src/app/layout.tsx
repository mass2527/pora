import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "~/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pora",
  description: "블로그를 생성하고 생각과 경험을 공유하세요.",
  verification: {
    google: "UrAbseg9KUEcpygfHffZg2n-ZY5nIoqY3JAHT0jLzqU",
    other: {
      "naver-site-verification": "c24772a72d9ca2f42398690c7c50f2df5a9ab4ab",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
