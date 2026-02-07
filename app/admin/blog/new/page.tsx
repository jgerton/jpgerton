"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogForm, BlogFormData } from "@/components/admin/blog-form";
import { toast } from "@/hooks/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function NewBlogPostPage() {
  const router = useRouter();
  const create = useMutation(api.blogPosts.create);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      await create({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        coverImageId: data.coverImageId
          ? (data.coverImageId as Id<"_storage">)
          : undefined,
        coverImageAlt: data.coverImageAlt,
      });
      toast({
        title: "Post created",
        description: `"${data.title}" has been created as a draft.`,
      });
      router.push("/admin/blog");
    } catch (error) {
      console.error("Create failed:", error);
      toast({
        title: "Create failed",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/blog");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">New Blog Post</h1>
      <BlogForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
