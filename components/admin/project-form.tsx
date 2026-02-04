"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadZone } from "./image-upload-zone";
import { Id } from "@/convex/_generated/dataModel";

// Form data types
export interface ProjectFormData {
  name: string;
  slug: string;
  description: string;
  descriptionLong?: string;
  status: "live" | "archived" | "in-progress";
  techStack: string[];
  techCategories: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  screenshotId?: Id<"_storage">;
}

export interface Project extends ProjectFormData {
  _id: Id<"projects">;
  displayOrder: number;
  createdAt: number;
  screenshotUrl?: string | null;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

// Zod schema for validation
const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  descriptionLong: z.string().optional(),
  status: z.enum(["live", "archived", "in-progress"]),
  techStack: z.array(z.string()),
  techCategories: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    infrastructure: z.array(z.string()),
  }),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean(),
  screenshotId: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function ProjectForm({ mode, initialData, onSubmit, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [frontendTechs, setFrontendTechs] = useState("");
  const [backendTechs, setBackendTechs] = useState("");
  const [infrastructureTechs, setInfrastructureTechs] = useState("");

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          descriptionLong: initialData.descriptionLong || "",
          status: initialData.status,
          techStack: initialData.techStack,
          techCategories: initialData.techCategories,
          liveUrl: initialData.liveUrl || "",
          githubUrl: initialData.githubUrl || "",
          featured: initialData.featured,
          screenshotId: initialData.screenshotId as string | undefined,
        }
      : {
          name: "",
          slug: "",
          description: "",
          descriptionLong: "",
          status: "in-progress",
          techStack: [],
          techCategories: {
            frontend: [],
            backend: [],
            infrastructure: [],
          },
          liveUrl: "",
          githubUrl: "",
          featured: false,
          screenshotId: undefined,
        },
  });

  // Initialize tech fields from initialData
  useEffect(() => {
    if (initialData?.techCategories) {
      setFrontendTechs(initialData.techCategories.frontend.join(", "));
      setBackendTechs(initialData.techCategories.backend.join(", "));
      setInfrastructureTechs(initialData.techCategories.infrastructure.join(", "));
    }
  }, [initialData]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (mode === "create") {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  };

  // Handle tech stack updates
  const updateTechStack = () => {
    const frontend = frontendTechs
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const backend = backendTechs
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const infrastructure = infrastructureTechs
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    form.setValue("techCategories", { frontend, backend, infrastructure });
    form.setValue("techStack", [...frontend, ...backend, ...infrastructure]);
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    setLoading(true);
    try {
      // Convert screenshotId to proper type if needed
      const formData: ProjectFormData = {
        ...values,
        liveUrl: values.liveUrl || undefined,
        githubUrl: values.githubUrl || undefined,
        descriptionLong: values.descriptionLong || undefined,
        screenshotId: values.screenshotId as Id<"_storage"> | undefined,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="My Awesome Project"
                  />
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
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="my-awesome-project" />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier (lowercase, hyphens only)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Brief one-line description" />
                </FormControl>
                <FormDescription>
                  Shown in project cards on the portfolio page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descriptionLong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Detailed project description..."
                    rows={5}
                  />
                </FormControl>
                <FormDescription>
                  Shown on the individual project detail page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 2: Image */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Screenshot</h2>

          <FormField
            control={form.control}
            name="screenshotId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploadZone
                    onUploadComplete={(storageId) => field.onChange(storageId)}
                    currentImageUrl={initialData?.screenshotUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 3: Tech Stack */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Technology Stack</h2>

          <div>
            <label htmlFor="frontend-techs" className="text-sm font-medium mb-2 block">Frontend Technologies</label>
            <Input
              id="frontend-techs"
              value={frontendTechs}
              onChange={(e) => setFrontendTechs(e.target.value)}
              onBlur={updateTechStack}
              placeholder="React, TypeScript, Tailwind CSS"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Comma-separated list
            </p>
          </div>

          <div>
            <label htmlFor="backend-techs" className="text-sm font-medium mb-2 block">Backend Technologies</label>
            <Input
              id="backend-techs"
              value={backendTechs}
              onChange={(e) => setBackendTechs(e.target.value)}
              onBlur={updateTechStack}
              placeholder="Node.js, Convex, PostgreSQL"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Comma-separated list
            </p>
          </div>

          <div>
            <label htmlFor="infrastructure-techs" className="text-sm font-medium mb-2 block">Infrastructure Technologies</label>
            <Input
              id="infrastructure-techs"
              value={infrastructureTechs}
              onChange={(e) => setInfrastructureTechs(e.target.value)}
              onBlur={updateTechStack}
              placeholder="Docker, Vercel, GitHub Actions"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Comma-separated list
            </p>
          </div>
        </div>

        {/* Section 4: Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Links</h2>

          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com" type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://github.com/user/repo" type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 5: Status & Visibility */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Status & Visibility</h2>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Project</FormLabel>
                  <FormDescription>
                    Display this project on the home page
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
