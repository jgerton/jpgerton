"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MarkdownEditor } from "./markdown-editor";
import { ImageUploadZone } from "./image-upload-zone";

export interface BlogFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: "Local Business" | "Technical" | "Announcement";
  coverImageId?: string;
  coverImageAlt?: string;
}

const blogFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    excerpt: z
      .string()
      .min(1, "Excerpt is required")
      .max(300, "Excerpt must be under 300 characters"),
    content: z.string().min(1, "Content is required"),
    category: z.enum(["Local Business", "Technical", "Announcement"]),
    coverImageId: z.string().optional(),
    coverImageAlt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.coverImageId && !data.coverImageAlt) {
        return false;
      }
      return true;
    },
    {
      message: "Cover image alt text is required when a cover image is present",
      path: ["coverImageAlt"],
    }
  );

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: "Local Business" | "Technical" | "Announcement";
    coverImageId?: string;
    coverImageAlt?: string;
    coverImageUrl?: string | null;
    status?: "draft" | "published";
  };
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
}

export function BlogForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const generateUploadUrl = useMutation(api.blogPosts.generateUploadUrl);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      category: initialData?.category ?? "Local Business",
      coverImageId: initialData?.coverImageId ?? "",
      coverImageAlt: initialData?.coverImageAlt ?? "",
    },
  });

  const handleSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  const isPublished = initialData?.status === "published";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    mode === "create"
                      ? "Auto-generated on save"
                      : "URL slug"
                  }
                  disabled={mode === "create" || isPublished}
                  {...field}
                />
              </FormControl>
              {mode === "edit" && (
                <FormDescription>
                  URL slug (cannot be changed once published)
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Local Business">Local Business</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary for preview cards"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/300 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUploadZone
                  onUploadComplete={(storageId) => {
                    field.onChange(storageId);
                  }}
                  currentImageUrl={initialData?.coverImageUrl}
                  generateUploadUrlFn={generateUploadUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImageAlt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image Alt Text</FormLabel>
              <FormControl>
                <Input placeholder="Describe the cover image" {...field} />
              </FormControl>
              <FormDescription>
                Required when cover image is present
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value ?? "")}
                  height={500}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Draft"
                : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
