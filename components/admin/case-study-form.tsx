"use client";

import { useState, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MarkdownEditor } from "./markdown-editor";
import { ImageUploadZone } from "./image-upload-zone";
import { Trash2, Plus } from "lucide-react";

// Helper: Combine 3 sections into single markdown string
export function combineSections(
  headings: { problem: string; solution: string; results: string },
  contents: { problem: string; solution: string; results: string }
): string {
  const sections: string[] = [];
  sections.push(`## ${headings.problem}\n\n${contents.problem}`);
  sections.push(`## ${headings.solution}\n\n${contents.solution}`);
  sections.push(`## ${headings.results}\n\n${contents.results}`);
  return sections.join("\n\n");
}

// Helper: Parse combined markdown back into 3 separate sections (index-based)
export function parseSections(
  combinedContent: string,
  headings: { problem: string; solution: string; results: string }
): {
  problemContent: string;
  solutionContent: string;
  resultsContent: string;
} {
  const lines = combinedContent.split("\n");

  const findHeadingIndex = (heading: string, startFrom = 0): number => {
    for (let i = startFrom; i < lines.length; i++) {
      if (lines[i].trim() === `## ${heading}`) return i;
    }
    return -1;
  };

  const problemIdx = findHeadingIndex(headings.problem);
  const solutionIdx = findHeadingIndex(headings.solution, problemIdx + 1);
  const resultsIdx = findHeadingIndex(headings.results, solutionIdx + 1);

  const extractBetween = (startIdx: number, endIdx: number): string => {
    if (startIdx === -1) return "";
    const end = endIdx === -1 ? lines.length : endIdx;
    return lines
      .slice(startIdx + 1, end)
      .join("\n")
      .trim();
  };

  return {
    problemContent: extractBetween(problemIdx, solutionIdx),
    solutionContent: extractBetween(solutionIdx, resultsIdx),
    resultsContent: extractBetween(resultsIdx, -1),
  };
}

const caseStudyFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    projectId: z.string().optional(),
    problemHeading: z.string().min(1, "Problem heading is required"),
    solutionHeading: z.string().min(1, "Solution heading is required"),
    resultsHeading: z.string().min(1, "Results heading is required"),
    combinedContent: z.string().min(1, "Content is required"),
    metrics: z.array(
      z.object({
        label: z.string().min(1, "Label required"),
        value: z.string().min(1, "Value required"),
      })
    ),
    coverImageId: z.string().optional(),
    coverImageAlt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.coverImageId && !data.coverImageAlt) return false;
      return true;
    },
    {
      message: "Alt text is required when cover image is provided",
      path: ["coverImageAlt"],
    }
  );

type CaseStudyFormValues = z.infer<typeof caseStudyFormSchema>;

export interface CaseStudyFormData {
  title: string;
  slug?: string;
  projectId?: string;
  problemHeading: string;
  problemContent: string;
  solutionHeading: string;
  solutionContent: string;
  resultsHeading: string;
  resultsContent: string;
  metrics: Array<{ label: string; value: string }>;
  coverImageId?: string;
  coverImageAlt?: string;
}

interface CaseStudyFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    slug: string;
    projectId?: string;
    problemHeading: string;
    problemContent: string;
    solutionHeading: string;
    solutionContent: string;
    resultsHeading: string;
    resultsContent: string;
    metrics: Array<{ label: string; value: string }>;
    coverImageId?: string;
    coverImageAlt?: string;
    coverImageUrl?: string | null;
    status?: "draft" | "published";
  };
  onSubmit: (data: CaseStudyFormData) => Promise<void>;
  onCancel: () => void;
}

export function CaseStudyForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: CaseStudyFormProps) {
  const projects = useQuery(api.projects.list);
  const generateUploadUrl = useMutation(api.caseStudies.generateUploadUrl);

  // Compute initial combined content
  const initialCombinedContent = initialData
    ? combineSections(
        {
          problem: initialData.problemHeading,
          solution: initialData.solutionHeading,
          results: initialData.resultsHeading,
        },
        {
          problem: initialData.problemContent,
          solution: initialData.solutionContent,
          results: initialData.resultsContent,
        }
      )
    : combineSections(
        { problem: "The Challenge", solution: "Our Approach", results: "The Results" },
        { problem: "", solution: "", results: "" }
      );

  const form = useForm<CaseStudyFormValues>({
    resolver: zodResolver(caseStudyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      projectId: initialData?.projectId || "",
      problemHeading: initialData?.problemHeading || "The Challenge",
      solutionHeading: initialData?.solutionHeading || "Our Approach",
      resultsHeading: initialData?.resultsHeading || "The Results",
      combinedContent: initialCombinedContent,
      metrics: initialData?.metrics.length ? initialData.metrics : [],
      coverImageId: initialData?.coverImageId || "",
      coverImageAlt: initialData?.coverImageAlt || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metrics",
  });

  const [submitting, setSubmitting] = useState(false);

  // Track previous heading values for syncing
  const prevHeadingsRef = useRef({
    problem: form.getValues("problemHeading"),
    solution: form.getValues("solutionHeading"),
    results: form.getValues("resultsHeading"),
  });

  // Sync heading changes into combinedContent
  const syncHeadingToContent = useCallback(
    (field: "problemHeading" | "solutionHeading" | "resultsHeading") => {
      const currentHeadings = {
        problem: form.getValues("problemHeading"),
        solution: form.getValues("solutionHeading"),
        results: form.getValues("resultsHeading"),
      };
      const content = form.getValues("combinedContent");

      const headingMap: Record<typeof field, keyof typeof prevHeadingsRef.current> = {
        problemHeading: "problem",
        solutionHeading: "solution",
        resultsHeading: "results",
      };
      const key = headingMap[field];
      const oldHeading = prevHeadingsRef.current[key];
      const newHeading = currentHeadings[key];

      if (oldHeading !== newHeading) {
        const updatedContent = content.replace(
          `## ${oldHeading}`,
          `## ${newHeading}`
        );
        form.setValue("combinedContent", updatedContent);
        prevHeadingsRef.current[key] = newHeading;
      }
    },
    [form]
  );

  const handleSubmit = async (values: CaseStudyFormValues) => {
    setSubmitting(true);
    try {
      const parsed = parseSections(
        values.combinedContent,
        {
          problem: values.problemHeading,
          solution: values.solutionHeading,
          results: values.resultsHeading,
        }
      );

      const data: CaseStudyFormData = {
        title: values.title,
        slug: values.slug || undefined,
        projectId: values.projectId || undefined,
        problemHeading: values.problemHeading,
        problemContent: parsed.problemContent,
        solutionHeading: values.solutionHeading,
        solutionContent: parsed.solutionContent,
        resultsHeading: values.resultsHeading,
        resultsContent: parsed.resultsContent,
        metrics: values.metrics,
        coverImageId: values.coverImageId || undefined,
        coverImageAlt: values.coverImageAlt || undefined,
      };

      await onSubmit(data);
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setSubmitting(false);
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
                <Input {...field} placeholder="Case Study Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "edit" && (
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPublished}
                    placeholder="auto-generated"
                  />
                </FormControl>
                {isPublished && (
                  <p className="text-sm text-muted-foreground">
                    Slug cannot be changed once published
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linked Project</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="None (standalone)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None (standalone)</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  onUploadComplete={field.onChange}
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
                <Input {...field} placeholder="Describe the image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Section Headings</h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="problemHeading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Heading</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={() => syncHeadingToContent("problemHeading")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="solutionHeading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solution Heading</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={() => syncHeadingToContent("solutionHeading")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resultsHeading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Results Heading</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onBlur={() => syncHeadingToContent("resultsHeading")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="combinedContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={field.value}
                  onChange={(val) => field.onChange(val || "")}
                  height={600}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Metrics</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: "", value: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name={`metrics.${index}.label`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Time Saved" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`metrics.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 40%" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting
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
