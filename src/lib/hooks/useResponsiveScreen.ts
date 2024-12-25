import { useState, useEffect, useRef } from 'react';

export function useResponsiveScreen(): number {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const prevWidthRef = useRef<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const prevWidth = prevWidthRef.current;
      
      const crossedThreshold = 
        (prevWidth < 1280 && currentWidth >= 1280) || 
        (prevWidth >= 1280 && currentWidth < 1280);

      if (crossedThreshold) {
        setWidth(currentWidth);
        prevWidthRef.current = currentWidth;
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
