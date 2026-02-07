import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
          padding: "60px",
        }}
      >
        {/* Name - large, top */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          Jon Gerton
        </div>

        {/* Tagline - prominent, middle */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            marginBottom: 60,
          }}
        >
          Custom Websites for $500
        </div>

        {/* URL - subtle footer, lower opacity */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            opacity: 0.7,
          }}
        >
          jpgerton.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
