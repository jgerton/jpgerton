// components/blog/blog-post-content.tsx
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </Markdown>
    </div>
  );
}
