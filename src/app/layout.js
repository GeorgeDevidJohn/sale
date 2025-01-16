import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationButtons from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Track sale",
  description: " Track, manage, and grow your business with our powerful tool built for modern needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-black`}
      > 
        {children}
      </body>
    </html>
  );
}
