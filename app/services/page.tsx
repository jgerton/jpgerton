"use client";

import { useRouter } from "next/navigation";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import type { PricingTier } from "@/components/pricing/pricing-card";

// TODO: Move to environment variable
const CALENDLY_URL = "https://calendly.com/jongerton/discovery-call";

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
    <div className="container max-w-6xl py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
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

      {/* FAQ / Additional Info */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Not sure which option is right for you?
        </h2>
        <p className="text-muted-foreground mb-6">
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
      <div className="mt-20 border-t pt-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">5 Days</div>
            <p className="text-muted-foreground">Average WordPress site delivery</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <p className="text-muted-foreground">Satisfaction guarantee</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10+ Years</div>
            <p className="text-muted-foreground">Professional experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
