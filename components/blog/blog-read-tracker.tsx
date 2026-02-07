"use client";

import { useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { trackBlogReadComplete } from "@/lib/analytics";

interface BlogReadTrackerProps {
  slug: string;
  readTimeMinutes: number;
}

/**
 * Invisible sentinel component that tracks when a user reaches the end of a blog post.
 * Fires a GA4 blog_read_complete event exactly once per page load.
 */
export function BlogReadTracker({ slug, readTimeMinutes }: BlogReadTrackerProps) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (isVisible) {
      trackBlogReadComplete(slug, readTimeMinutes);
    }
  }, [isVisible, slug, readTimeMinutes]);

  return <div ref={elementRef} aria-hidden="true" />;
}
