'use client'

import React, { useRef, useEffect } from 'react';
import cupScene from './threejs/cupScene';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Creating cup scene");

    if (typeof window !== 'undefined') {
      if (containerRef.current) {
        cupScene(containerRef.current);
      }
    }
  }, []);
  return <div className='absolute top-0 right-0 w-full h-full flex justify-end' ref={containerRef} />;
};

export default ThreeScene;