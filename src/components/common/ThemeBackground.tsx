import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import StarBackground from './StarBackground';

const ThemeBackground: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <>
      {isDark ? (
        <StarBackground />
      ) : (
        // Placeholder for light theme background; keep empty for now
        <div className="fixed inset-0 pointer-events-none z-0" />
      )}
    </>
  );
};

export default ThemeBackground;
