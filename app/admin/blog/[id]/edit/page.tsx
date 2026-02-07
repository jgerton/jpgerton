"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogForm, BlogFormData } from "@/components/admin/blog-form";
import { toast } from "@/hooks/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as Id<"blogPosts">;
  const post = useQuery(api.blogPosts.getById, { id: postId });
  const update = useMutation(api.blogPosts.update);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      await update({
        id: postId,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        coverImageId: data.coverImageId
          ? (data.coverImageId as Id<"_storage">)
          : undefined,
        coverImageAlt: data.coverImageAlt,
      });
      toast({
        title: "Post updated",
        description: `"${data.title}" has been updated successfully.`,
      });
      router.push("/admin/blog");
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Update failed",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/blog");
  };

  if (post === undefined) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>Loading...</div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>Blog post not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      <BlogForm
        mode="edit"
        initialData={post}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
