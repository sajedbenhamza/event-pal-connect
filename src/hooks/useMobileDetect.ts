
import { useState, useEffect } from 'react';

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
      );
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
