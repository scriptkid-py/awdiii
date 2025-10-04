import React, { useEffect, useState } from 'react';
import './LoadingPage.css';

interface GeometricShape {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'square' | 'triangle';
}

const LoadingPage: React.FC = () => {
  const [shapes, setShapes] = useState<GeometricShape[]>([]);

  useEffect(() => {
    // Generate random geometric shapes
    const generatedShapes: GeometricShape[] = [];
    for (let i = 0; i < 15; i++) {
      generatedShapes.push({
        id: i,
        size: Math.random() * 80 + 40, // 40-120px
        left: Math.random() * 100, // 0-100%
        duration: Math.random() * 10 + 10, // 10-20s
        delay: Math.random() * 5, // 0-5s
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
      });
    }
    setShapes(generatedShapes);
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-background"></div>
      
      {/* Animated geometric shapes */}
      <div className="geometric-shapes">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`shape shape--${shape.shape}`}
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.left}%`,
              animationDuration: `${shape.duration}s`,
              animationDelay: `${shape.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main loading text */}
      <div className="loading-content">
        <h1 className="loading-title">SkillShare</h1>
      </div>
    </div>
  );
};

export default LoadingPage;

