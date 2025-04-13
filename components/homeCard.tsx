'use client';
// import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import Image from 'next/image';

export default function HomeCard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Card
      className="relative flex-grow mt-0 px-4 items-center rounded-b-none shadow-lg"
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