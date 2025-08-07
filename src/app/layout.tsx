import type { Metadata } from "next";
import { Commissioner, Aleo, Lato } from "next/font/google";
import "./globals.css";

const commissionerSans = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
});

const aleoSans = Aleo({
  variable: "--font-aleo",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
        className={`${aleoSans.variable} ${latoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
