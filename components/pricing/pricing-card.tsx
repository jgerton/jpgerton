import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  price: string | null; // null = "Contact for pricing"
  description: string;
  benefits: string[];
  cta: string;
  ctaAction: "calendly" | "contact";
  highlighted?: boolean;
  badge?: string;
}

interface PricingCardProps extends PricingTier {
  onCtaClick: () => void;
  calendlySlot?: React.ReactNode; // For Calendly button injection
}

export function PricingCard({
  name,
  price,
  description,
  benefits,
  cta,
  onCtaClick,
  highlighted = false,
  badge,
  calendlySlot,
  ctaAction,
}: PricingCardProps) {
  return (
    <Card className={cn(
      "flex flex-col",
      highlighted && "border-primary shadow-lg scale-105"
    )}>
      <CardHeader className="text-center">
        {badge && (
          <Badge className="w-fit mx-auto mb-xs" variant="default">
            {badge}
          </Badge>
        )}
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-md">
          {price ? (
            <span className="text-4xl font-bold">{price}</span>
          ) : (
            <span className="text-xl font-semibold text-muted-foreground">Contact for pricing</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-sm">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex gap-xs">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {ctaAction === "calendly" && calendlySlot ? (
          calendlySlot
        ) : (
          <Button
            onClick={onCtaClick}
            className="w-full"
            variant={highlighted ? "default" : "outline"}
          >
            {cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
