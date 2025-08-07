import type { Metadata } from "next";
import { Commissioner, Lora, Lato } from "next/font/google";
import "./globals.css";

const commissionerSans = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
});

const loraSans = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const latoSans = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Your Work Desk",
  description: "Your Work Desk App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${loraSans.variable} ${latoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
