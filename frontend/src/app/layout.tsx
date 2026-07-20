import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PreNippon - Shop Figure & Anime Merchandise Chính Hãng",
  description: "Đặt trước (preorder) figure, mô hình, Nendoroid chính hãng từ Good Smile Company, Kotobukiya, Alter. Đảm bảo uy tín, cọc 30%, ship toàn quốc.",
  keywords: "figure, preorder, nendoroid, scale figure, anime, manga, model kit, chính hãng, giá rẻ, hà nội, hcm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
