import { WithContext, Person } from "schema-dts";

export function PersonSchema() {
  const jsonLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jon Gerton",
    jobTitle: "Full-Stack Developer & Technical Consultant",
    url: "https://jpgerton.com",
    email: "jon@jpgerton.com",
    sameAs: [
      "https://www.linkedin.com/in/jon-gerton-8009a9393/",
      "https://github.com/jgerton",
    ],
    knowsAbout: [
      "Web Development",
      "WordPress",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Technical Mentorship",
    ],
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: "AK",
        addressCountry: "US",
      },
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
