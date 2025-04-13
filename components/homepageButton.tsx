import React from "react";

// IconWithText.tsx

interface IconWithTextProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export const IconWithText: React.FC<IconWithTextProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-center">
      <div className="bg-primary p-3 rounded-full mr-4">{icon}</div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-sm">{description}</div>
      </div>
    </div>
  );
};
