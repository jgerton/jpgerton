import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  /** Percentage of element visible before triggering (default: 0.1) */
  threshold?: number;
  /** Margin around viewport for early trigger (default: "50px") */
  rootMargin?: string;
  /** Only animate once per element (default: true) */
  triggerOnce?: boolean;
}

/**
 * Custom hook to detect when an element enters the viewport using the Intersection Observer API.
 *
 * Respects `prefers-reduced-motion` by immediately marking elements as visible when the user
 * has requested reduced motion, preventing animation delays.
 *
 * @param options - Configuration options for the observer
 * @param options.threshold - Percentage of element visible before triggering (default: 0.1)
 * @param options.rootMargin - Margin around viewport for early trigger (default: "50px")
 * @param options.triggerOnce - Only animate once per element (default: true)
 * @returns Object containing elementRef to attach to target element and isVisible state
 *
 * @example
 * ```tsx
 * const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>();
 *
 * return (
 *   <div
 *     ref={elementRef}
 *     className={cn(
 *       "opacity-0 translate-y-5 transition-all duration-300",
 *       isVisible && "opacity-100 translate-y-0"
 *     )}
 *   >
 *     Content that animates in
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): { elementRef: React.RefObject<T | null>; isVisible: boolean } {
  const { threshold = 0.1, rootMargin = "50px", triggerOnce = true } = options;

  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // If triggerOnce is true, stop observing after first trigger
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}
