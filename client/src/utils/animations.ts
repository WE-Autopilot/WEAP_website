/**
 * Animations utility using modern browser APIs for performant animations
 */
import { useEffect, useRef, useState } from "react";

interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
  once?: boolean;
}

interface ScrollData {
  scrollY: number;
  direction: "up" | "down" | "none";
}

/**
 * Hook to observe when an element enters the viewport
 * @param callback - Function to call when element enters viewport
 * @param options - IntersectionObserver options
 * @returns ref to attach to the element
 */
export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverOptions = {}
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback(entry);

          // If once is true, unobserve after first intersection
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
        ...options,
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
  }, [callback, options]);

  return ref;
};

/**
 * Hook to create staggered animations for lists
 * @param itemCount - Number of items to animate
 * @param staggerMs - Milliseconds between each item animation
 * @returns Array of boolean values indicating if item should be visible
 */
export const useStaggeredAnimation = (
  itemCount: number,
  staggerMs = 100
): number[] => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, i * staggerMs);

      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [itemCount, staggerMs]);

  return visibleItems;
};

/**
 * Hook to track scroll position for parallax effects
 * @returns scrollY value and scroll direction
 */
export const useScrollPosition = (): ScrollData => {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scrollY: 0,
    direction: "none",
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";

      setScrollData({ scrollY, direction });
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollData;
};

/**
 * Add a CSS class to an element after it enters the viewport
 * @param className - Class to add when element is visible
 * @param options - IntersectionObserver options
 * @returns ref to attach to the element
 */
export const useAnimateIn = <T extends HTMLElement = HTMLDivElement>(
  className: string,
  options: IntersectionObserverOptions = {}
): React.RefObject<T> => {
  return useIntersectionObserver<T>((entry) => {
    entry.target.classList.add(className);
  }, options);
};
