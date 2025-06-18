"use client"

import React from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineScene() {
  return (
    <div className="w-full h-full">
      <Spline 
        scene="https://prod.spline.design/your-scene-url/scene.splinecode" 
        className="w-full h-full"
      />
    </div>
  );
} 