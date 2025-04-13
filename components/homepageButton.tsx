'use client'

import React from "react";
import { redirect } from 'next/navigation'

interface IconWithTextProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  url?: string;
}

export const IconWithText: React.FC<IconWithTextProps> = ({ icon, title, description, url }) => {
  return (
    // TODO: Fix onclick
    <button className="flex items-center text-left" onClick={() => { url && redirect(url) }}>
      <div className="bg-primary p-3 rounded-full mr-4">{icon}</div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-sm">{description}</div>
      </div>
    </button>
  );
};
