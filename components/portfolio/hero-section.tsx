import { CTAButton } from "@/components/portfolio/cta-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-3xl px-md text-center">
      <h1 className="font-serif font-semibold text-hero leading-tight mb-md text-foreground">
        Professional WordPress Sites from $500
      </h1>
      <p className="font-serif italic text-h5 leading-snug text-muted-foreground mb-xl max-w-2xl mx-auto">
        Fast, mobile-friendly websites for local businesses. Custom development also available.
      </p>
      <div className="flex flex-col sm:flex-row gap-md justify-center">
        <CTAButton asChild intent="warm" size="xl">
          <Link href="/services">Get Your $500 Site</Link>
        </CTAButton>
        <Button asChild variant="outline" size="lg">
          <Link href="/projects">View Portfolio</Link>
        </Button>
      </div>
    </section>
  );
}
