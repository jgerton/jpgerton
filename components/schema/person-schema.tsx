import { WithContext, Person } from "schema-dts";

export function PersonSchema() {
  const jsonLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jon Gerton",
    jobTitle: "Web Designer & Developer",
    url: "https://jpgerton.com",
    email: "jon@jpgerton.com",
    sameAs: [
      "https://linkedin.com/in/jongerton",
      "https://github.com/jgerton",
    ],
    knowsAbout: [
      "Web Development",
      "WordPress",
      "React",
      "Next.js",
      "TypeScript",
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
