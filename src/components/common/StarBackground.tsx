import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
  animationDuration: number;
}

interface Meteor {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  animationDuration: number;
}

const StarBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const numberOfStars = Math.floor((window.innerWidth * window.innerHeight) / 10000);
      const newStars: Star[] = [];
      for (let i = 0; i < numberOfStars; i++) {
        newStars.push({
          id: i + Math.floor(Math.random() * 10000),
          size: Math.random() * 3 + 1,
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.5 + 0.5,
          animationDuration: Math.random() * 4 + 2,
        });
      }
      setStars(newStars);
    };

    const generateMeteors = () => {
      const numberOfMeteors = 4;
      const newMeteors: Meteor[] = [];
      for (let i = 0; i < numberOfMeteors; i++) {
        newMeteors.push({
          id: i + Math.floor(Math.random() * 10000),
          size: Math.random() * 2 + 1,
          x: Math.random() * 100,
          y: Math.random() * 60,
          delay: Math.random() * 15,
          animationDuration: Math.random() * 3 + 3,
        });
      }
      setMeteors(newMeteors);
    };

    generateStars();
    generateMeteors();

    const handleResize = () => {
      generateStars();
      generateMeteors();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 starry-backdrop">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-pulse-subtle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor animate-meteor"
          style={{
            width: `${meteor.size * 30}px`,
            height: `${meteor.size}px`,
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
