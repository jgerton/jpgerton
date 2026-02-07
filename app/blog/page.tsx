"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { CategoryFilter } from "@/components/blog/category-filter";
import { PaginationBar } from "@/components/blog/pagination-bar";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useMemo, Suspense } from "react";

function BlogListContent() {
  const allPosts = useQuery(api.blogPosts.listPublished, {});

  const [selectedCategory, setSelectedCategory] = useQueryState(
    "category",
    parseAsString
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  // Derive available categories from posts
  const visibleCategories = useMemo(() => {
    if (!allPosts) return [];
    const categorySet = new Set<string>();
    allPosts.forEach((post) => {
      categorySet.add(post.category);
    });
    return Array.from(categorySet).sort();
  }, [allPosts]);

  // Filter by category
  const filteredPosts = useMemo(() => {
    if (!allPosts) return [];
    if (!selectedCategory) return allPosts;
    return allPosts.filter((post) => post.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  // Pagination
  const postsPerPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, page]);

  // Handle category change - reset to page 1
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Loading state
  if (allPosts === undefined) {
    return (
      <main className="min-h-screen bg-background">
        <SectionBackground variant="neutral">
          <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights on web design, local business growth, and the tech behind
            it all.
          </p>
        </SectionBackground>

        <SectionBackground variant="muted">
          <div className="space-y-lg">
            {/* Loading skeleton */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-card border rounded-lg animate-pulse"
              />
            ))}
          </div>
        </SectionBackground>
      </main>
    );
  }

  // Empty states
  const showEmptyState =
    filteredPosts.length === 0 && !selectedCategory && allPosts.length === 0;
  const showNoCategoryResults =
    filteredPosts.length === 0 && selectedCategory !== null;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero section */}
      <SectionBackground variant="neutral">
        <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
          Blog
        </h1>
        <p className="text-xl text-muted-foreground">
          Insights on web design, local business growth, and the tech behind it
          all.
        </p>
      </SectionBackground>

      {/* Content section */}
      <SectionBackground variant="muted">
        {/* Category filter */}
        <CategoryFilter
          categories={visibleCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Coming soon empty state */}
        {showEmptyState && (
          <div className="text-center py-3xl">
            <h2 className="font-serif text-h2 leading-tight mb-md">
              Coming Soon
            </h2>
            <p className="text-muted-foreground mb-xl max-w-2xl mx-auto">
              I&apos;m working on some great content about local business web
              design, technical insights, and company updates. Check back soon,
              or get in touch if you have questions!
            </p>
            <Link href="/contact">
              <Button size="lg">Book a Call</Button>
            </Link>
          </div>
        )}

        {/* No posts in selected category */}
        {showNoCategoryResults && (
          <div className="text-center py-3xl">
            <p className="text-muted-foreground text-lg">
              No posts in this category yet.
            </p>
          </div>
        )}

        {/* Post list */}
        {currentPosts.length > 0 && (
          <>
            <div className="space-y-lg">
              {currentPosts.map((post) => (
                <BlogPostCard
                  key={post._id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImageUrl={post.coverImageUrl}
                  coverImageAlt={post.coverImageAlt}
                  category={post.category}
                  readingTime={post.readingTime}
                  publishedAt={post.publishedAt ?? 0}
                />
              ))}
            </div>

            {/* Pagination */}
            <PaginationBar
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </SectionBackground>
    </main>
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background">
          <SectionBackground variant="neutral">
            <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">Loading...</p>
          </SectionBackground>
        </main>
      }
    >
      <BlogListContent />
    </Suspense>
  );
}
