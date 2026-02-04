import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-20 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
        Professional WordPress Sites from $500
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Fast, mobile-friendly websites for local businesses. Custom development also available.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/services">Get Your $500 Site</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/projects">View Portfolio</Link>
        </Button>
      </div>
    </section>
  );
}
