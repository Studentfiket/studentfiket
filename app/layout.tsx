import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Studentfiket",
  description: "Studentfiket på Campus Norrköping",
  icons: {
    icon: "./icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <Header />
        <main className="min-h-[92vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
