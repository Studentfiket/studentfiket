'use client';
// import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import Image from 'next/image';

export default function HomeCard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [marginTop, setMarginTop] = useState(-64);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     const newMarginTop = Math.max(-64, -64 + scrollY * 0.07); // Adjust the multiplier for desired effect
  //     setMarginTop(newMarginTop);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <Card
      className="relative flex-grow mt-0 px-4 items-center shadow-lg rounded-none rounded-t-[2rem]"
    >
      <div>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={2000}
          height={619} />
      </div>
      {children}
    </Card>
  );
}