'use client'

import { useState, useEffect } from 'react';

const useFadeInOnScroll = (ref: React.RefObject<HTMLElement>) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the entry is intersecting and hasn't been visible before, set it to visible
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
          observer.unobserve(entry.target); // Optionally, stop observing after it becomes visible
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, hasBeenVisible]);

  return hasBeenVisible;
};

export default useFadeInOnScroll; 