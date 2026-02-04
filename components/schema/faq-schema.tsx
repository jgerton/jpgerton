import { WithContext, FAQPage } from "schema-dts";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSchemaProps = {
  questions: FAQItem[];
};

export function FAQSchema({ questions }: FAQSchemaProps) {
  const jsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-answer"],
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
