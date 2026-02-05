"use client";

import { useRouter } from "next/navigation";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import { FAQSchema, ServiceSchema } from "@/components/schema";
import type { PricingTier } from "@/components/pricing/pricing-card";

// TODO: Move to environment variable
const CALENDLY_URL = "https://calendly.com/jongerton/discovery-call";

const faqData = [
  {
    question: "How long does it take to build a $500 WordPress site?",
    answer:
      "Most WordPress sites are delivered within 5 business days from when I receive your content and payment. Complex requirements may take slightly longer.",
  },
  {
    question: "What's included in the $500 WordPress package?",
    answer:
      "You get a professional 5-7 page website with mobile-responsive design, contact form, Google Maps integration, basic SEO setup, one round of revisions, and 30 days of support after launch.",
  },
  {
    question: "Do I need to provide my own hosting?",
    answer:
      "You'll need hosting and a domain name. I can recommend affordable options ($50-100/year total) and help you get set up if needed.",
  },
  {
    question: "Can I update the website myself after it's built?",
    answer:
      "Yes! WordPress is designed for easy content updates. I'll provide a brief training on how to edit text, add images, and make basic changes.",
  },
  {
    question: "What if I need changes after the site is launched?",
    answer:
      "You get one round of revisions included. After that, I offer maintenance packages or hourly rates for additional updates and changes.",
  },
  {
    question: "Do you work with businesses outside Alaska?",
    answer:
      "Absolutely! While I'm based in Alaska, I work with clients across the US. Everything can be done remotely via video calls and email.",
  },
];

const serviceTiers: PricingTier[] = [
  {
    name: "$500 WordPress Sites",
    price: "$500",
    description: "Perfect for local businesses ready to get online fast",
    benefits: [
      "Get online in 5 business days",
      "Looks great on phones, tablets, and desktops",
      "Contact form so customers can reach you 24/7",
      "Show up on Google Maps for local search",
      "Basic SEO to help people find you",
      "One round of revisions included",
      "30 days of support after launch",
      "Built on WordPress - easy for you to update",
    ],
    cta: "Book Your $500 Site Call",
    ctaAction: "calendly",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Custom Web Apps",
    price: null,
    description: "Tailored solutions for unique business needs",
    benefits: [
      "Custom features built for your workflow",
      "Modern tech stack (React, Next.js, Node)",
      "Database design and API integration",
      "User authentication and role management",
      "Scalable architecture for growth",
      "Ongoing maintenance available",
      "Training and documentation included",
      "Timeline and pricing based on scope",
    ],
    cta: "Discuss Your Project",
    ctaAction: "contact",
    highlighted: false,
  },
  {
    name: "Team Growth Accelerator",
    price: null,
    description: "Help your developers level up faster",
    benefits: [
      "Personalized mentorship for your team",
      "Code review and architecture guidance",
      "Best practices for modern web development",
      "Testing and CI/CD implementation",
      "Performance optimization strategies",
      "Career growth and leadership skills",
      "Flexible engagement (workshop or ongoing)",
      "Remote or on-site options available",
    ],
    cta: "Learn More",
    ctaAction: "contact",
    highlighted: false,
  },
];

export default function ServicesPage() {
  const router = useRouter();

  const handleContactClick = () => {
    router.push("/contact");
  };

  const renderCalendlyButton = (tier: PricingTier) => (
    <CalendlyButton
      url={CALENDLY_URL}
      text={tier.cta}
      variant="default"
      className="w-full"
    />
  );

  return (
    <div className="container max-w-6xl py-2xl">
      {/* Hero Section */}
      <div className="text-center mb-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-md">
          Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From quick WordPress sites for local businesses to custom web applications -
          find the right solution for your needs.
        </p>
      </div>

      {/* Pricing Cards */}
      <PricingCards
        tiers={serviceTiers}
        onContactClick={handleContactClick}
        renderCalendlyButton={renderCalendlyButton}
      />

      {/* FAQ Section */}
      <div className="mt-3xl">
        <h2 className="text-2xl font-semibold mb-xl text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-lg max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="border rounded-lg p-lg">
              <h3 className="font-medium mb-xs">{faq.question}</h3>
              <p className="text-muted-foreground faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-3xl text-center">
        <h2 className="text-2xl font-semibold mb-md">
          Not sure which option is right for you?
        </h2>
        <p className="text-muted-foreground mb-lg">
          Let&apos;s chat! I&apos;ll help you figure out the best approach for your business.
        </p>
        <CalendlyButton
          url={CALENDLY_URL}
          text="Schedule a Free Consultation"
          variant="outline"
          size="lg"
        />
      </div>

      {/* Trust Section */}
      <div className="mt-3xl border-t pt-2xl">
        <div className="grid md:grid-cols-3 gap-xl text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-xs">5 Days</div>
            <p className="text-muted-foreground">Average WordPress site delivery</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-xs">100%</div>
            <p className="text-muted-foreground">Satisfaction guarantee</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-xs">18+ Years</div>
            <p className="text-muted-foreground">Web development experience</p>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <FAQSchema questions={faqData} />
      <ServiceSchema />
    </div>
  );
}
