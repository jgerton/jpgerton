"use client";

import { useRouter } from "next/navigation";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import { FAQSchema, ServiceSchema } from "@/components/schema";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
import { CTABanner } from "@/components/portfolio/sections/cta-banner";
import { SocialProofDisplay } from "@/components/portfolio/social-proof-display";
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
    cta: "Get Your Business Online",
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
    cta: "Discuss Your Vision",
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
    cta: "Level Up Your Team",
    ctaAction: "contact",
    highlighted: false,
  },
];

const whatsIncluded = [
  {
    title: "Mobile-Responsive Design",
    description: "Looks great on every device, from phones to desktops.",
  },
  {
    title: "SEO Foundation",
    description:
      "Basic search optimization so customers can find you on Google.",
  },
  {
    title: "Contact Form",
    description: "Let customers reach you 24/7, even when you're closed.",
  },
  {
    title: "Content Training",
    description: "Learn to update your own site with a simple walkthrough.",
  },
];

const trustMetrics = [
  { value: "5 Days", label: "Average WordPress Delivery" },
  { value: "100%", label: "Satisfaction Guarantee" },
  { value: "18+ Years", label: "Web Development Experience" },
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
      className="w-full bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90"
    />
  );

  return (
    <div>
      {/* Section 1: Hero (neutral) */}
      <SectionBackground variant="neutral">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
            Transparent Pricing, Professional Results
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No surprise invoices. Choose the right solution for
            your business.
          </p>
        </div>
      </SectionBackground>

      {/* Section 2: Pricing Cards (gradient for emphasis) */}
      <SectionBackground variant="gradient">
        <PricingCards
          tiers={serviceTiers}
          onContactClick={handleContactClick}
          renderCalendlyButton={renderCalendlyButton}
        />
      </SectionBackground>

      {/* Section 3: What's Included (neutral) */}
      <SectionBackground variant="neutral">
        <h2 className="font-serif text-h2 leading-tight text-center mb-xl">
          What Every WordPress Site Includes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg max-w-3xl mx-auto">
          {whatsIncluded.map((feature) => (
            <div key={feature.title} className="text-left">
              <h3 className="font-semibold mb-xs">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </SectionBackground>

      {/* Section 4: FAQ (muted) */}
      <SectionBackground variant="muted">
        <h2 className="font-serif text-h2 leading-tight mb-xl text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-lg max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="border rounded-lg p-lg bg-card">
              <h3 className="font-medium mb-xs">{faq.question}</h3>
              <p className="text-muted-foreground faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </SectionBackground>

      {/* Section 5: Mid-page CTA (neutral) */}
      <SectionBackground variant="neutral">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-h3 leading-snug mb-md">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-lg">
            Book a free 15-minute call to discuss your project.
          </p>
          <CalendlyButton
            url={CALENDLY_URL}
            text="Get Your Business Online"
            variant="default"
            size="lg"
            className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90"
          />
        </div>
      </SectionBackground>

      {/* Section 6: Trust Stats (gradient) */}
      <SectionBackground variant="gradient">
        <SocialProofDisplay metrics={trustMetrics} />
      </SectionBackground>

      {/* Section 7: End-page CTA Banner */}
      <CTABanner
        headline="Let's Get Your Business Online"
        description="A professional website is the first step to reaching more customers. Let's make it happen."
        primaryCta={{
          text: "Get Your Business Online",
          href: "/contact",
          intent: "warm",
        }}
        secondaryCta={{
          text: "View My Work",
          href: "/projects",
        }}
      />

      {/* Schema Markup */}
      <FAQSchema questions={faqData} />
      <ServiceSchema />
    </div>
  );
}
