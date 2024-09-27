'use client'

import React, { useRef, useEffect } from 'react';
import cupScene from './threejs/cupScene';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  // const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      cupScene('coffee-cup');
    }
  }, []);
  return <div id='coffee-cup' />;
};

export default ThreeScene;