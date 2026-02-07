"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SortableBlogList } from "@/components/admin/sortable-blog-list";
import { BlogPost } from "@/components/admin/sortable-blog-row";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function BlogPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const posts = useQuery(api.blogPosts.list, {});
  const reorder = useMutation(api.blogPosts.reorder);
  const remove = useMutation(api.blogPosts.remove);

  const filteredPosts = posts?.filter(
    (p) => statusFilter === "all" || p.status === statusFilter
  );

  const draftCount = posts?.filter((p) => p.status === "draft").length ?? 0;
  const publishedCount = posts?.filter((p) => p.status === "published").length ?? 0;

  const handleReorder = async (reorderedPosts: BlogPost[]) => {
    try {
      await reorder({ postIds: reorderedPosts.map((p) => p._id) });
      toast({
        title: "Order updated",
        description: "Blog post order has been saved.",
      });
    } catch (error) {
      console.error("Reorder failed:", error);
      toast({
        title: "Reorder failed",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (post: BlogPost) => {
    try {
      await remove({ id: post._id });
      toast({
        title: "Post deleted",
        description: `"${post.title}" has been deleted.`,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (posts === undefined) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
        >
          All ({posts.length})
        </Button>
        <Button
          variant={statusFilter === "draft" ? "default" : "outline"}
          onClick={() => setStatusFilter("draft")}
        >
          Draft ({draftCount})
        </Button>
        <Button
          variant={statusFilter === "published" ? "default" : "outline"}
          onClick={() => setStatusFilter("published")}
        >
          Published ({publishedCount})
        </Button>
      </div>

      {filteredPosts && filteredPosts.length > 0 ? (
        <Card className="p-6">
          <SortableBlogList
            posts={filteredPosts}
            onReorder={handleReorder}
            onDelete={handleDelete}
          />
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No blog posts yet. Create your first post!
          </p>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
