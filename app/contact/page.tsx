"use client";

import { ContactForm } from "@/components/forms/contact-form";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Move to environment variable
const CALENDLY_URL = "https://calendly.com/jongerton/discovery-call";

export default function ContactPage() {
  return (
    <div className="container max-w-5xl py-2xl">
      {/* Hero Section */}
      <div className="text-center mb-2xl">
        <h1 className="font-serif font-semibold text-h1 leading-tight mb-md">
          Let&apos;s Build Something Together
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Whether you need a quick WordPress site or a custom web application,
          I&apos;d love to hear about your project.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-2xl">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Tell me about your project and I&apos;ll get back to you within 1 business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Quick Booking Option */}
        <div className="space-y-xl">
          {/* Calendly Card */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Book a Call Instead</CardTitle>
              <CardDescription>
                Want to chat right away? Schedule a free 15-minute discovery call.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-md">
                Best for: $500 WordPress site inquiries or quick questions about custom projects.
              </p>
              <CalendlyButton
                url={CALENDLY_URL}
                text="Schedule a Call"
                variant="default"
                size="lg"
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-md">
              <div>
                <h4 className="font-medium mb-1">Email</h4>
                <a
                  href="mailto:jon@jpgerton.com"
                  className="text-primary hover:underline"
                >
                  jon@jpgerton.com
                </a>
              </div>
              <div>
                <h4 className="font-medium mb-1">GitHub</h4>
                <a
                  href="https://github.com/jgerton"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @jgerton
                </a>
              </div>
              <div>
                <h4 className="font-medium mb-1">LinkedIn</h4>
                <a
                  href="https://www.linkedin.com/in/jon-gerton-8009a9393/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Jon Gerton
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Response Time */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Typical response time: within 1 business day</p>
          </div>
        </div>
      </div>
    </div>
  );
}
