"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadZoneProps {
  onUploadComplete: (storageId: string) => void;
  currentImageUrl?: string | null;
  className?: string;
}

export function ImageUploadZone({
  onUploadComplete,
  currentImageUrl,
  className,
}: ImageUploadZoneProps) {
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      // Generate upload URL immediately before upload
      const uploadUrl = await generateUploadUrl();

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      const { storageId } = await result.json();

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Notify parent component
      onUploadComplete(storageId);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        className
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p>Uploading...</p>
      ) : preview || currentImageUrl ? (
        <div>
          <img
            src={preview || currentImageUrl!}
            alt="Preview"
            className="max-h-48 mx-auto mb-2 rounded"
          />
          <p className="text-sm text-muted-foreground">
            Drop a new image or click to replace
          </p>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p>Drag and drop an image here, or click to browse</p>
          <p className="text-sm text-muted-foreground mt-1">
            PNG, JPG, WebP up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}
