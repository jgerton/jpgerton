import { useCallback, useEffect, useState } from "react";

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
 * Uses a callback ref pattern so the observer is correctly created even when the
 * target element mounts after initial render (e.g., after a loading state resolves).
 *
 * Respects `prefers-reduced-motion` by immediately marking elements as visible when the user
 * has requested reduced motion, preventing animation delays.
 *
 * @param options - Configuration options for the observer
 * @param options.threshold - Percentage of element visible before triggering (default: 0.1)
 * @param options.rootMargin - Margin around viewport for early trigger (default: "50px")
 * @param options.triggerOnce - Only animate once per element (default: true)
 * @returns Object containing elementRef callback to attach to target element and isVisible state
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): { elementRef: (node: T | null) => void; isVisible: boolean } {
  const { threshold = 0.1, rootMargin = "50px", triggerOnce = true } = options;

  const [element, setElement] = useState<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Callback ref: fires whenever the DOM node mounts/unmounts
  const elementRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

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
  }, [element, threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}
