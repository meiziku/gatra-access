import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AnggotaProvider } from "@/context/AnggotaContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gatra Access - Koperasi Modern untuk Masa Depan Anggota",
  description: "Tumbuh Bersama, Sejahtera Bersama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        <AnggotaProvider>
          {children}
        </AnggotaProvider>
      </body>
    </html>
  );
}
