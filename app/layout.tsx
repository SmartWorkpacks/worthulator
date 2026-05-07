import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../src/components/Layout/Footer";
import Header from "../src/components/Layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://worthulator.com"),
  title: "Worthulator | Free Financial Calculators",
  description:
    "Free financial calculators for salary, investments, budgeting and more. Get instant answers to your money questions — no sign-up required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafaf9] text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
