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
    <div className="container max-w-4xl py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Hey, I&apos;m Jon
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Web developer, team builder, and small business advocate
          based in the Midwest.
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        {/* Background Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Background</h2>
          <p>
            I&apos;ve spent over a decade building web applications, from startup MVPs to
            enterprise platforms serving millions of users. Along the way, I discovered
            something surprising: the most rewarding work isn&apos;t always the most complex.
          </p>
          <p>
            When I helped a friend launch his local plumbing business online, the impact
            was immediate. New customers called. His schedule filled up. His family&apos;s
            financial stress eased. That&apos;s when I realized there&apos;s a massive gap between
            &quot;big tech&quot; web development and what local businesses actually need.
          </p>
        </section>

        {/* My Approach Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Approach</h2>
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
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Work With Me</h2>
          <div className="grid sm:grid-cols-2 gap-6 not-prose">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">No Jargon</h3>
                <p className="text-sm text-muted-foreground">
                  I explain things in plain English. You&apos;ll always understand what
                  you&apos;re getting and why it matters.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Fixed Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  For WordPress sites, you know the cost upfront. No surprise invoices.
                  No scope creep surprises.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Real Experience</h3>
                <p className="text-sm text-muted-foreground">
                  10+ years shipping production code. I&apos;ve seen what works and
                  what doesn&apos;t, and I&apos;ll share that knowledge.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Ongoing Support</h3>
                <p className="text-sm text-muted-foreground">
                  I don&apos;t disappear after launch. Every project includes support,
                  and I&apos;m always available for questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Beyond Code Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Beyond the Code</h2>
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
      <div className="bg-muted rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Whether you need a quick WordPress site or have a custom project in mind,
          let&apos;s talk about how I can help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      <div className="mt-12 grid grid-cols-3 gap-8 text-center border-t pt-12">
        <div>
          <div className="text-3xl font-bold text-primary">10+</div>
          <p className="text-sm text-muted-foreground">Years Experience</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">50+</div>
          <p className="text-sm text-muted-foreground">Projects Shipped</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">100%</div>
          <p className="text-sm text-muted-foreground">Client Satisfaction</p>
        </div>
      </div>

      {/* Schema Markup */}
      <PersonSchema />
    </div>
  );
}
