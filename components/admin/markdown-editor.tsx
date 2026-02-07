"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border rounded-lg flex items-center justify-center text-muted-foreground">
      Loading editor...
    </div>
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  height?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  height = 400,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit"
      />
    </div>
  );
}
