import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BackgroundColorWrapper from "@/components/layout/backgroundColorWrapper";


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
        <BackgroundColorWrapper>
          <Header />
          <main className="min-h-[92vh]">
            {children}
          </main>
          <Footer />
        </BackgroundColorWrapper>
      </body>
    </html>
  );
}
