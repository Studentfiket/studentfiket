import { Suspense } from "react";
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
      <body className="antialiased">
        <Header />
        <Suspense fallback={
          <div className="h-[92vh] relative w-full flex justify-center  gap-2 sm:items-center bg-slate-100">
            {Array.from({ length: 5 }).map((_, index) => {
              const size = Math.random() * 50 + 10;
              return (
                <div
                  key={index}
                  className="animate-pulse bg-gray-300 rounded-md"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    position: "absolute",
                    top: `${Math.random() * 80}vh`,
                    left: `${Math.random() * 80}vw`,
                  }}
                />
              );
            })}
          </div>
        }>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
