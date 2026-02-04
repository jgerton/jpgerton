import { WithContext, LocalBusiness } from "schema-dts";

export function LocalBusinessSchema() {
  const jsonLd: WithContext<LocalBusiness> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Jon Gerton Web Design",
    description: "Professional WordPress websites starting at $500",
    url: "https://jpgerton.com",
    email: "jon@jpgerton.com",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    sameAs: [
      "https://linkedin.com/in/jongerton",
      "https://github.com/jgerton",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
