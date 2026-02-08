"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTAButton } from "@/components/portfolio/cta-button";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import { siteConfig } from "@/lib/site-config";
import { CheckCircle2 } from "lucide-react";

interface AuditThankYouProps {
  onAuditAnother: () => void;
}

export function AuditThankYou({ onAuditAnother }: AuditThankYouProps) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-lg">
      <Card elevation="sm" className="p-xl">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-md" />
        <h3 className="font-serif text-h3 leading-snug mb-sm">
          Your Report is On Its Way!
        </h3>
        <p className="text-muted-foreground mb-lg">
          Check your inbox for a detailed analysis with specific recommendations
          to improve your website.
        </p>

        <div className="space-y-md">
          <div>
            <p className="font-medium mb-sm">
              Want to discuss the results?
            </p>
            <CalendlyButton
              url={siteConfig.calendly.discoveryCallUrl}
              text="Book a Free Consultation"
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-sm justify-center pt-md border-t">
            <CTAButton intent="primary" size="default" onClick={onAuditAnother}>
              Audit Another Site
            </CTAButton>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
