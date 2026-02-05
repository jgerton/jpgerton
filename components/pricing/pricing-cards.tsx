"use client";

import { PricingCard, type PricingTier } from "./pricing-card";

interface PricingCardsProps {
  tiers: PricingTier[];
  onContactClick: () => void;
  renderCalendlyButton: (tier: PricingTier) => React.ReactNode;
}

export function PricingCards({ tiers, onContactClick, renderCalendlyButton }: PricingCardsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl">
      {tiers.map((tier) => (
        <PricingCard
          key={tier.name}
          {...tier}
          onCtaClick={onContactClick}
          calendlySlot={tier.ctaAction === "calendly" ? renderCalendlyButton(tier) : undefined}
        />
      ))}
    </div>
  );
}
