"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import { PersonSchema } from "@/components/schema";

// TODO: Move to environment variable
const CALENDLY_URL = "https://calendly.com/jongerton/discovery-call";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-2xl">
      {/* Hero Section */}
      <div className="text-center mb-2xl">
        <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
          Hey, I&apos;m Jon
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Web developer, team builder, and small business advocate
          based in Alaska.
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg dark:prose-invert max-w-prose mb-2xl">
        {/* Background Section */}
        <section className="mb-2xl">
          <h2 className="font-serif font-medium text-h2 leading-tight mb-md">Background</h2>
          <p>
            I started in tech in 1998 as a Systems/Network Administrator for a regional
            airline, managing production infrastructure where uptime mattered. After
            recognizing software was a better fit for my skill set, I transitioned to
            full-stack development in 2007.
          </p>
          <p>
            I spent 13 years at three software development agencies, shipping projects
            across dozens of industries and tech stacks. When COVID hit and AI-assisted
            development started advancing rapidly, I made the intentional move to solo
            founder - building with a vision to mentor junior developers into sustainable
            career paths.
          </p>
          <p>
            Along the way, I discovered the most rewarding work isn&apos;t always the most
            complex. When I helped a friend launch his local business online, the impact
            was immediate - new customers called, his schedule filled up, his family&apos;s
            financial stress eased. That&apos;s when I realized there&apos;s a massive gap between
            &quot;big tech&quot; web development and what local businesses actually need.
          </p>
        </section>

        {/* My Approach Section */}
        <section className="mb-2xl">
          <h2 className="font-serif font-medium text-h2 leading-tight mb-md">My Approach</h2>
          <p>
            I believe in meeting people where they are. For a local pizza shop, that means
            a clean, fast website that shows up on Google, not a complex custom application.
            For a growing startup, it means scalable architecture that won&apos;t need a rewrite
            in two years.
          </p>
          <p>
            That&apos;s why I offer both <strong>$500 WordPress sites</strong> for local businesses
            and <strong>custom web applications</strong> for companies with unique needs.
            Different problems deserve different solutions.
          </p>
        </section>

        {/* Why Work With Me Section */}
        <section className="mb-2xl">
          <h2 className="font-serif font-medium text-h2 leading-tight mb-md">Why Work With Me</h2>
          <div className="grid sm:grid-cols-2 gap-lg not-prose">
            <Card>
              <CardContent className="pt-lg">
                <h3 className="font-semibold mb-xs">No Jargon</h3>
                <p className="text-sm text-muted-foreground">
                  I explain things in plain English. You&apos;ll always understand what
                  you&apos;re getting and why it matters.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-lg">
                <h3 className="font-semibold mb-xs">Fixed Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  For WordPress sites, you know the cost upfront. No surprise invoices.
                  No scope creep surprises.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-lg">
                <h3 className="font-semibold mb-xs">Real Experience</h3>
                <p className="text-sm text-muted-foreground">
                  27 years in tech, 18+ in web development. I&apos;ve seen what works
                  and what doesn&apos;t, and I&apos;ll share that knowledge.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-lg">
                <h3 className="font-semibold mb-xs">Ongoing Support</h3>
                <p className="text-sm text-muted-foreground">
                  I don&apos;t disappear after launch. Every project includes support,
                  and I&apos;m always available for questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Beyond Code Section */}
        <section className="mb-2xl">
          <h2 className="font-serif font-medium text-h2 leading-tight mb-md">Beyond the Code</h2>
          <p>
            When I&apos;m not building websites, you&apos;ll find me mentoring junior developers,
            contributing to open source, or exploring hiking trails with my family.
            I&apos;m a firm believer that sustainable work leads to better outcomes,
            for clients, for teams, and for me.
          </p>
          <p>
            I also run workshops for engineering teams on topics like testing practices,
            code review culture, and building psychologically safe teams. If your
            organization is looking to level up, I&apos;d love to chat.
          </p>
        </section>
      </div>

      {/* CTA Section */}
      <div className="bg-muted rounded-lg p-xl text-center">
        <h2 className="font-serif font-medium text-h2 leading-tight mb-md">
          Ready to Get Started?
        </h2>
        <p className="text-muted-foreground mb-lg max-w-xl mx-auto">
          Whether you need a quick WordPress site or have a custom project in mind,
          let&apos;s talk about how I can help.
        </p>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <CalendlyButton
            url={CALENDLY_URL}
            text="Book a Call"
            variant="default"
            size="lg"
          />
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">View My Work</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-2xl grid grid-cols-3 gap-xl text-center border-t pt-2xl">
        <div>
          <div className="text-h3 font-bold text-primary">27+</div>
          <p className="text-sm text-muted-foreground">Years in Tech</p>
        </div>
        <div>
          <div className="text-h3 font-bold text-primary">13</div>
          <p className="text-sm text-muted-foreground">Years at Agencies</p>
        </div>
        <div>
          <div className="text-h3 font-bold text-primary">100%</div>
          <p className="text-sm text-muted-foreground">Client Satisfaction</p>
        </div>
      </div>

      {/* Schema Markup */}
      <PersonSchema />
    </div>
  );
}
