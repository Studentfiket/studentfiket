'use client'

import React from "react";
import Link from "next/link";

interface IconWithTextProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  url: string;
}

export const IconWithText: React.FC<IconWithTextProps> = ({ icon, title, description, url }) => {
  return (
    <Link className="flex items-center text-left" href={url}>
      <div className="bg-latteDark p-3 rounded-full mr-4">{icon}</div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-sm">{description}</div>
      </div>
    </Link>
  );
};
