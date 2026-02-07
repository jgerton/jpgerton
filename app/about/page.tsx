"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PersonSchema } from "@/components/schema";
import { SectionBackground } from "@/components/portfolio/sections/section-background";
import { CTAButton } from "@/components/portfolio/cta-button";

const processSteps = [
  {
    step: 1,
    title: "Discovery Call",
    description:
      "We chat for 15 minutes about your business, your goals, and what you need from your website.",
  },
  {
    step: 2,
    title: "Content & Design",
    description:
      "I build your site using your content and brand. You review and request one round of changes.",
  },
  {
    step: 3,
    title: "Launch",
    description:
      "Your site goes live within 5 business days. I handle all the technical details.",
  },
  {
    step: 4,
    title: "Ongoing Support",
    description:
      "30 days of support included. I'm always available if you have questions.",
  },
];

const values = [
  {
    title: "No Jargon",
    description:
      "I explain things in plain English. You'll always understand what you're getting and why it matters.",
  },
  {
    title: "Fixed Pricing",
    description:
      "For WordPress sites, you know the cost upfront. No surprise invoices. No scope creep surprises.",
  },
  {
    title: "Real Experience",
    description:
      "27 years in tech, 18+ in web development. I've seen what works and what doesn't, and I'll share that knowledge.",
  },
  {
    title: "Ongoing Support",
    description:
      "I don't disappear after launch. Every project includes support, and I'm always available for questions.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Section 1: Hero (neutral) */}
      <SectionBackground variant="neutral">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
            How I Work
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A straightforward process focused on getting your business online
            quickly and professionally.
          </p>
        </div>
      </SectionBackground>

      {/* Section 2: Process Steps (gradient) */}
      <SectionBackground variant="gradient">
        <h2 className="font-serif text-h2 leading-tight text-center mb-xl">
          From Idea to Launch in 4 Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {processSteps.map((step) => (
            <Card key={step.step} elevation="sm" className="p-lg text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-md">
                {step.step}
              </div>
              <h3 className="font-semibold mb-sm">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </SectionBackground>

      {/* Section 3: Values (neutral) */}
      <SectionBackground variant="neutral">
        <h2 className="font-serif text-h2 leading-tight text-center mb-xl">
          What You Can Expect
        </h2>
        <div className="grid sm:grid-cols-2 gap-lg max-w-3xl mx-auto">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="pt-lg">
                <h3 className="font-semibold mb-xs">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionBackground>

      {/* Section 4: Background (muted, brief) */}
      <SectionBackground variant="muted">
        <div className="max-w-prose mx-auto">
          <h2 className="font-serif text-h2 leading-tight mb-md">
            A Bit About Me
          </h2>
          <p className="text-muted-foreground mb-md leading-relaxed">
            I&apos;ve been in tech since 1998, starting as a Systems
            Administrator and transitioning to full-stack development in 2007.
            After 13 years at three software agencies shipping projects across
            dozens of industries, I went solo to focus on what matters most.
          </p>
          <p className="text-muted-foreground mb-md leading-relaxed">
            The turning point came when I helped a friend launch his local
            business online. New customers called, his schedule filled up, and
            his family&apos;s financial stress eased. That&apos;s when I
            realized there&apos;s a massive gap between &quot;big tech&quot; web
            development and what local businesses actually need.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            That gap is why $500 WordPress sites exist. Not every business needs
            a custom application. Sometimes a clean, fast website that shows up
            on Google is exactly the right solution.
          </p>
        </div>
      </SectionBackground>

      {/* Section 5: Lighter CTA (neutral) */}
      <SectionBackground variant="neutral">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif text-h3 leading-snug mb-md">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-lg max-w-xl mx-auto">
            Whether you need a quick WordPress site or have a custom project in
            mind, let&apos;s talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <CTAButton asChild intent="warm" size="lg">
              <Link href="/services">Get Your Business Online</Link>
            </CTAButton>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">View My Work</Link>
            </Button>
          </div>
        </div>
      </SectionBackground>

      {/* Schema Markup */}
      <PersonSchema />
    </main>
  );
}
