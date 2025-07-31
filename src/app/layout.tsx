import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import "./globals.css";

const commissionerSans = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
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
        className={`${commissionerSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
