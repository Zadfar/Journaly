import { useState, useEffect } from "react";

export default function useVisualViewport() {
  const [style, setStyle] = useState({ bottom: '0px' });

  useEffect(() => {
    // 1. Check if browser supports VisualViewport API (Safari/Chrome Mobile)
    if (!window.visualViewport) return;

    const handleResize = () => {
      // visualViewport.height = Height of visible screen ABOVE the keyboard
      // window.innerHeight = Total height of screen (often hidden behind keyboard)
      
      const viewport = window.visualViewport;
      
      // Calculate how much the keyboard pushed up
      // On iOS, offsetTop becomes > 0 when keyboard is open
      const keyboardHeight = window.innerHeight - viewport.height;
      
      // If keyboard is likely open (height is significantly smaller)
      // We stick the container to the visual bottom
      setStyle({ 
        bottom: `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`
      });
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  return style;
}