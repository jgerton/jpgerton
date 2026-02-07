import { WithContext, Service } from "schema-dts";

export function ServiceSchema() {
  const jsonLd: WithContext<Service> = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web Design",
    provider: {
      "@type": "Person",
      name: "Jon Gerton",
      url: "https://jpgerton.com",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Design Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "$500 WordPress Website",
            description:
              "Professional WordPress site delivered in 5 days. Includes 5-7 pages, mobile responsive design, contact form, and basic SEO.",
          },
          price: "500",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Web Application",
            description:
              "Tailored web applications built with modern frameworks like React, Next.js, and Node.js.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Team Growth Accelerator",
            description:
              "Developer mentorship, code review, and engineering team consulting services.",
          },
        },
      ],
    },
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
