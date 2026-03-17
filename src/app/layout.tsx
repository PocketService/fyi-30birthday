import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geburtstagsfeier",
  description: "Planung der Geburtstagsfeier - 19. bis 21. Juni",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
