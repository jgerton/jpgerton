import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await fetchQuery(api.blogPosts.getBySlug, { slug });
  } catch {
    post = null;
  }

  // Fallback if post not found
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #003F75 0%, #2884BD 100%)",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
            }}
          >
            Jon Gerton
          </div>
          <div
            style={{
              fontSize: 32,
              marginTop: 20,
              opacity: 0.9,
            }}
          >
            Web Design & Development
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Truncate title if too long
  const title = post.title.length > 80 ? post.title.slice(0, 77) + "..." : post.title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #003F75 0%, #2884BD 100%)",
          color: "white",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            {post.category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 40,
            marginBottom: 40,
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            opacity: 0.9,
          }}
        >
          <div>jpgerton.com</div>
          <div>{post.readingTime} min read</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
