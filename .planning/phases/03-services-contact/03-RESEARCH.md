# Phase 3: Services & Contact - Research

**Researched:** 2026-02-03
**Domain:** Conversion-focused UX with forms, booking widgets, and email notifications
**Confidence:** HIGH

## Summary

This phase implements conversion-critical pages combining React Hook Form with Zod validation, Calendly popup widgets, and Convex-Resend email integration. The research confirms that the standard 2026 stack prioritizes type-safe validation, accessible form patterns, and benefit-focused copy over feature lists. Calendly's popup widget keeps users in context while booking, and the Convex Resend component provides production-ready email delivery with queueing and retry logic.

Key architectural patterns include client-side form components with server actions for submission, honeypot spam protection without CAPTCHA friction, and thank-you pages that provide clear next steps rather than dead ends. The pricing card patterns leverage shadcn/ui's Card component with highlighting for the anchor tier ($500 WordPress offer).

**Primary recommendation:** Use React Hook Form with Zod schemas shared between client/server, load Calendly widget dynamically with `ssr: false` to avoid hydration errors, and leverage the official Convex Resend component for reliable email delivery.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.71.1 | Form state management | Minimal re-renders, uncontrolled components, 10x less code than controlled forms |
| zod | 4.3.6 | Schema validation | TypeScript-first, runtime validation matches types, shared client/server schemas |
| @hookform/resolvers | 5.2.2 | Zod + RHF integration | Official resolver connecting Zod schemas to React Hook Form |
| react-calendly | Latest | Calendly popup widget | Official React wrapper, supports PopupWidget/PopupButton/PopupModal patterns |
| @convex-dev/resend | Latest | Email delivery | Official Convex component with queueing, batching, durable execution, idempotency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Form | Installed | Accessible form components | All forms - provides FormField, FormItem, FormLabel patterns with ARIA |
| shadcn/ui Card | Installed | Pricing card structure | Service tier presentation with CardHeader, CardContent, CardFooter |
| shadcn/ui Badge | Installed | Visual highlights | "Most Popular" or "Best Value" badges on pricing cards |
| shadcn/ui Dialog | Installed | Modal patterns | Optional custom modals if needed beyond Calendly's built-in |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Calendly popup | Inline embed | Popup keeps user in context, inline requires dedicated page space |
| Resend | Nodemailer direct | Resend handles deliverability, retries, webhooks; Nodemailer requires manual setup |
| React Hook Form | Formik | RHF has better performance (uncontrolled), smaller bundle, better TS support |

**Installation:**
```bash
bun add react-calendly @convex-dev/resend
# react-hook-form, zod, @hookform/resolvers already installed
# shadcn/ui components (form, card, badge) already installed
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── services/
│   └── page.tsx            # Client component with pricing cards
├── contact/
│   ├── page.tsx            # Client component with contact form + Calendly
│   └── thank-you/
│       └── page.tsx        # Success state after form submission
└── about/
    └── page.tsx            # Server or client component with structured sections

components/
├── forms/
│   ├── contact-form.tsx    # React Hook Form + Zod validation
│   └── honeypot-field.tsx  # Spam protection without CAPTCHA
├── calendly/
│   └── calendly-button.tsx # Dynamic import wrapper for SSR safety
└── pricing/
    ├── pricing-cards.tsx   # Service tier card grid
    └── pricing-card.tsx    # Individual tier card component

convex/
├── schema.ts               # Add contactSubmissions table
├── contacts.ts             # Mutations for form storage
└── actions.ts              # Resend email sending (use node runtime)

lib/
└── validations/
    └── contact-schema.ts   # Shared Zod schemas
```

### Pattern 1: React Hook Form with Zod (Client-Side Validation)
**What:** Type-safe form validation using Zod schemas with React Hook Form's Controller pattern
**When to use:** All forms requiring validation (contact, booking inquiries)
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/forms/react-hook-form + https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form

// lib/validations/contact-schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  projectType: z.enum(["wordpress", "custom-web-app", "consulting", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().length(0), // Must be empty
});

export type ContactFormData = z.infer<typeof contactSchema>;

// components/forms/contact-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact-schema";

export function ContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "wordpress",
      message: "",
      honeypot: "", // Critical: set default for spam field
    },
  });

  async function onSubmit(data: ContactFormData) {
    // Call Convex mutation
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other fields... */}
      </form>
    </Form>
  );
}
```

### Pattern 2: Calendly Popup Widget (Dynamic Import for SSR Safety)
**What:** Load Calendly widget only on client-side to avoid Next.js hydration errors
**When to use:** All Calendly booking buttons across Services, Home, About pages
**Example:**
```typescript
// Source: https://github.com/tcampb/react-calendly + https://medium.com/@dileep18052001/integrate-calendly-with-next-js-step-by-step-guide-dbb0b2fc30c9

// components/calendly/calendly-button.tsx
"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamic import with SSR disabled - prevents hydration errors
const PopupButton = dynamic(
  () => import("react-calendly").then((mod) => mod.PopupButton),
  { ssr: false }
);

interface CalendlyButtonProps {
  url: string; // Your Calendly scheduling URL
  text?: string;
  variant?: "default" | "outline";
}

export function CalendlyButton({
  url,
  text = "Book a Call",
  variant = "default"
}: CalendlyButtonProps) {
  return (
    <PopupButton
      url={url}
      rootElement={document.getElementById("__next")!}
      text={text}
      className="shadcn-button-classes" // Style to match shadcn Button
    />
  );
}
```

### Pattern 3: Convex Action with Resend (Email Notifications)
**What:** Send emails from Convex actions using Node runtime and official Resend component
**When to use:** Form submission notifications, booking confirmations
**Example:**
```typescript
// Source: https://resend.com/convex + https://github.com/get-convex/resend

// convex/convex.config.ts
import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config.js";

const app = defineApp();
app.use(resend);
export default app;

// convex/actions.ts
"use node"; // Required for Resend component

import { v } from "convex/values";
import { action } from "./_generated/server";
import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

export const sendContactNotification = action({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(components.resend, {});

    await resend.sendEmail(ctx, {
      from: "notifications@yourdomain.com",
      to: "your@email.com",
      subject: `New ${args.projectType} inquiry from ${args.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${args.name}</p>
        <p><strong>Email:</strong> ${args.email}</p>
        <p><strong>Project Type:</strong> ${args.projectType}</p>
        <p><strong>Message:</strong></p>
        <p>${args.message}</p>
      `,
    });
  },
});
```

### Pattern 4: Honeypot Anti-Spam (No CAPTCHA Friction)
**What:** Hidden field that bots fill but humans don't see, blocking 90% of spam
**When to use:** All public contact forms
**Example:**
```typescript
// Source: https://formidableforms.com/defeat-spambots-honeypot-spam-protection/

// components/forms/honeypot-field.tsx
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function HoneypotField({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="honeypot"
      render={({ field }) => (
        <FormItem className="absolute -left-[9999px]" aria-hidden="true">
          <FormControl>
            <Input
              {...field}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

// In contact-schema.ts validation:
honeypot: z.string().length(0, "Bot detected"), // Reject if filled
```

### Pattern 5: Benefit-Focused Pricing Cards
**What:** Service tier cards emphasizing outcomes over features (max 8-10 benefits per tier)
**When to use:** Services page pricing presentation
**Example:**
```typescript
// Source: https://www.shadcnblocks.com/blocks/pricing + https://millermedia7.com/blog/conversion-focused-ux-design/

// components/pricing/pricing-card.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string | null; // null = "Contact"
  description: string;
  benefits: string[]; // Max 8-10 outcome-focused items
  cta: string;
  onCtaClick: () => void;
  highlighted?: boolean;
  badge?: string;
}

export function PricingCard({
  name,
  price,
  description,
  benefits,
  cta,
  onCtaClick,
  highlighted = false,
  badge
}: PricingCardProps) {
  return (
    <Card className={highlighted ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        {badge && <Badge variant="default">{badge}</Badge>}
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          {price ? (
            <span className="text-4xl font-bold">{price}</span>
          ) : (
            <span className="text-2xl font-semibold">Contact for pricing</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex gap-2">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onCtaClick}
          className="w-full"
          variant={highlighted ? "default" : "outline"}
        >
          {cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Anti-Patterns to Avoid
- **Don't forget default values in useForm** - Causes dirty field tracking bugs, especially with Zod schemas
- **Don't load Calendly without dynamic import** - Causes Next.js hydration errors because Calendly requires browser DOM
- **Don't list 15+ features per pricing tier** - 34% lower conversion vs 8-10 key benefits
- **Don't use controlled components unnecessarily** - React Hook Form's uncontrolled approach is more performant
- **Don't skip aria-describedby on form inputs** - Required for screen reader error announcements

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP logic | Convex Resend component | Handles retries, queueing, batching, webhook tracking, deliverability |
| Form validation | Manual error state | React Hook Form + Zod | Type-safe, minimal re-renders, automatic error handling, accessible |
| Booking widget | Custom calendar UI | Calendly popup | Handles scheduling, timezones, reminders, conflicts, confirmations |
| Spam protection | Custom bot detection | Honeypot field | 90% effective without CAPTCHA friction, simple CSS hide |
| ARIA patterns | Custom accessibility | shadcn/ui Form components | Automatic aria-describedby, aria-invalid, proper label associations |
| Email templates | String concatenation | React Email (optional) | Type-safe JSX templates, preview mode, tested across clients |

**Key insight:** Conversion-focused forms require accessibility, validation, spam protection, and email delivery. Each of these has well-tested solutions that handle edge cases (timezone math, deliverability, screen readers, bot patterns) better than custom code.

## Common Pitfalls

### Pitfall 1: Calendly Hydration Errors
**What goes wrong:** Importing Calendly components normally causes "Text content does not match server-rendered HTML" errors in Next.js
**Why it happens:** Calendly widget accesses browser APIs (window, document) during render, which don't exist during SSR
**How to avoid:** Use Next.js dynamic imports with `ssr: false` option
**Warning signs:**
- Console error: "Hydration failed because initial UI does not match..."
- Calendly button renders but clicking does nothing
- `window.Calendly` undefined errors

```typescript
// WRONG: Direct import
import { PopupButton } from "react-calendly"; // Causes hydration error

// RIGHT: Dynamic import
const PopupButton = dynamic(
  () => import("react-calendly").then((mod) => mod.PopupButton),
  { ssr: false }
);
```

### Pitfall 2: Forgetting React Hook Form Default Values
**What goes wrong:** Form state becomes inconsistent, dirty field tracking fails, validation behaves unexpectedly
**Why it happens:** RHF tracks which fields changed by comparing against default values; missing defaults = no baseline
**How to avoid:** Always provide complete defaultValues matching your Zod schema shape, even for empty strings
**Warning signs:**
- Form submits when it shouldn't be valid
- Reset button doesn't work
- `formState.isDirty` always false
- Zod errors but form shows as valid

```typescript
// WRONG: Missing defaults
const form = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
  // defaultValues missing
});

// RIGHT: Complete defaults
const form = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
  defaultValues: {
    name: "",
    email: "",
    projectType: "wordpress",
    message: "",
    honeypot: "",
  },
});
```

### Pitfall 3: Using Features List Instead of Benefits
**What goes wrong:** Pricing pages with 15+ feature bullets see 34% lower conversion than 8-10 benefit-focused items
**Why it happens:** Visitors care about outcomes ("Get online in 5 days") not features ("5-7 pages included")
**How to avoid:** Transform feature lists into outcome statements. Max 10 items per tier, focus on transformation
**Warning signs:**
- Copy reads like a technical spec sheet
- Each tier has 15+ bullet points
- Bullets describe what's included, not what customer achieves
- Visitor says "I don't understand what this means for me"

```typescript
// WRONG: Feature-focused
benefits: [
  "5-7 pages included",
  "Responsive design",
  "Contact form",
  "Google Maps integration",
  // 11 more features...
]

// RIGHT: Benefit-focused (8 items max)
benefits: [
  "Get online in 5 business days",
  "Looks great on phones, tablets, and desktops",
  "Customers can reach you 24/7 with contact form",
  "Show up on Google Maps for local search",
  "Basic SEO so people can find you",
  "Mobile-friendly for on-the-go customers",
  "One round of revisions included",
  "30 days of support after launch",
]
```

### Pitfall 4: Server-Side Validation Bypass
**What goes wrong:** Client-side validation with Zod but no server-side check allows malicious data through
**Why it happens:** Client-side JavaScript can be disabled or manipulated; validation must run on server too
**How to avoid:** Use same Zod schema in both client form and server mutation/action
**Warning signs:**
- Form validation in browser but Convex mutation has no validation
- Invalid data appears in database
- Users report submitting invalid forms successfully

```typescript
// WRONG: Only client validation
// contact-form.tsx has Zod but contacts.ts mutation doesn't check

// RIGHT: Shared schema server-side
// convex/contacts.ts
import { contactSchema } from "@/lib/validations/contact-schema";

export const createContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    message: v.string(),
    honeypot: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate with same Zod schema
    const validated = contactSchema.parse(args); // Throws if invalid

    // honeypot check
    if (validated.honeypot !== "") {
      throw new Error("Bot detected");
    }

    return await ctx.db.insert("contactSubmissions", validated);
  },
});
```

### Pitfall 5: Dead-End Thank You Pages
**What goes wrong:** User submits form, sees "Thank you" page, then... nothing. No next steps, no engagement
**Why it happens:** Treating thank-you pages as confirmation-only instead of conversion continuation
**How to avoid:** Provide clear next steps matching intent (what happens next, when, secondary CTA)
**Warning signs:**
- Thank-you page is just "Thanks! We'll be in touch."
- No indication of timeline or next action
- Visitor bounces immediately after form submission
- Lost opportunity for secondary conversion (newsletter, social follow)

```typescript
// WRONG: Dead end
<div>
  <h1>Thank You!</h1>
  <p>We'll be in touch soon.</p>
</div>

// RIGHT: Clear next steps
<div>
  <h1>Thanks for Reaching Out!</h1>
  <p>I'll review your {projectType} inquiry and respond within 1 business day.</p>

  <Card className="mt-6">
    <CardHeader>
      <CardTitle>While You Wait...</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Check out some recent projects similar to yours:</p>
      {/* Show 2-3 relevant projects */}
    </CardContent>
  </Card>

  <div className="mt-6">
    <p className="text-sm text-muted-foreground">
      Prefer to chat right away?
      <CalendlyButton url="..." text="Book a 15-min call" variant="link" />
    </p>
  </div>
</div>
```

## Code Examples

Verified patterns from official sources:

### Contact Form with Convex Submission
```typescript
// Source: https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form + Convex docs

// components/forms/contact-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact-schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HoneypotField } from "./honeypot-field";

export function ContactForm() {
  const router = useRouter();
  const { toast } = useToast();
  const createContact = useMutation(api.contacts.create);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "wordpress",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    try {
      // Submit to Convex
      await createContact(data);

      // Redirect to thank-you page
      router.push("/contact/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <FormControl>
                <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="wordpress">$500 WordPress Site</option>
                  <option value="custom-web-app">Custom Web App</option>
                  <option value="consulting">Team Growth Accelerator</option>
                  <option value="other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Tell me about your project..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <HoneypotField control={form.control} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
```

### Pricing Cards Grid
```typescript
// Source: https://www.shadcnblocks.com/blocks/pricing + conversion research

// app/services/page.tsx
"use client";

import { PricingCard } from "@/components/pricing/pricing-card";
import { CalendlyButton } from "@/components/calendly/calendly-button";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();

  const tiers = [
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
      cta: "Book Your $500 Site Call",
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
        "User authentication and roles",
        "Scalable architecture for growth",
        "Ongoing maintenance available",
        "Training and documentation included",
        "Timeline and pricing based on scope",
      ],
      cta: "Discuss Your Project",
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
      cta: "Learn More",
      ctaAction: "contact",
      highlighted: false,
    },
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Services</h1>
        <p className="text-xl text-muted-foreground">
          Choose the right fit for your business
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.name}
            {...tier}
            onCtaClick={() => {
              if (tier.ctaAction === "calendly") {
                // CalendlyButton handles this
              } else {
                router.push("/contact");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Formik + Yup validation | React Hook Form + Zod | 2022-2023 | Better TS support, smaller bundle, uncontrolled inputs = less re-renders |
| Inline Calendly embed | Popup widget modal | 2021-2024 | Keeps user in context, no redirect, better conversion |
| Custom SMTP libraries | Resend API | 2023-2024 | Better deliverability, webhook tracking, simpler setup |
| CAPTCHA for spam | Honeypot fields | 2020-present | No user friction, 90% effective, better accessibility |
| Feature-list pricing | Benefit-focused copy | 2023-2026 | 34% better conversion (8-10 benefits vs 15+ features) |
| Manual ARIA attributes | shadcn/ui Form components | 2023-present | Automatic aria-describedby, aria-invalid, proper associations |

**Deprecated/outdated:**
- **Formik**: Still works but React Hook Form has better performance and smaller bundle
- **Inline Calendly embed**: Popup pattern preferred for keeping user in context
- **Nodemailer direct**: Resend handles deliverability better with simpler API
- **Manual form accessibility**: shadcn/ui Form components provide ARIA patterns automatically

## Open Questions

Things that couldn't be fully resolved:

1. **Calendly Event Type Strategy (Single vs Multiple)**
   - What we know: Calendly supports multiple event types (15min call, 30min consultation, etc.)
   - What's unclear: Whether single generic event or multiple specific events converts better
   - Recommendation: Start with single event type ("Book a Discovery Call - 15min") for simplicity. Add multiple types if data shows visitors confused about time commitment.

2. **Post-Booking Confirmation Flow**
   - What we know: Calendly default confirmation works, or can redirect to custom thank-you page
   - What's unclear: Which approach provides better user experience
   - Recommendation: Use Calendly's default confirmation initially (less maintenance). Custom thank-you only if need to track conversions or provide specific next steps.

3. **Email Notification Timing (Immediate vs Batched)**
   - What we know: Resend component supports both immediate sending and batching
   - What's unclear: Whether instant notification or 5-minute batch improves response time vs reliability
   - Recommendation: Use immediate sending for contact form (expectation of fast response). Batching only needed for high-volume scenarios.

## Sources

### Primary (HIGH confidence)
- [react-calendly GitHub](https://github.com/tcampb/react-calendly) - Official React wrapper with PopupWidget/PopupModal API
- [Convex Resend Component](https://github.com/get-convex/resend) - Official integration with queueing, batching, webhooks
- [Resend + Convex Guide](https://stack.convex.dev/convex-resend) - Setup instructions and best practices
- [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form) - Official Form component patterns
- Existing codebase: package.json confirms react-hook-form 7.71.1, zod 4.3.6, @hookform/resolvers 5.2.2 installed
- Existing codebase: shadcn/ui form, card, badge components already available in components/ui/

### Secondary (MEDIUM confidence)
- [React Hook Form with Zod Guide](https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form) - Type-safe validation patterns for Next.js 14+
- [Calendly Next.js Integration Guide](https://medium.com/@dileep18052001/integrate-calendly-with-next-js-step-by-step-guide-dbb0b2fc30c9) - SSR considerations and dynamic imports
- [Next.js Accessibility Guide](https://nextjs.org/docs/architecture/accessibility) - aria-describedby patterns for forms
- [Conversion-Focused UX Design](https://millermedia7.com/blog/conversion-focused-ux-design/) - Benefit-focused copy vs feature lists (34% conversion difference)
- [Pricing Page Conversion Patterns](https://payan.design/blog/conversion-rate-optimization-ux) - 8-10 benefits max, trust signal placement
- [Thank You Page Best Practices](https://www.tilipmandigital.com/resource-center/articles/thank-you-page-examples) - Next steps instead of dead ends
- [Honeypot Anti-Spam](https://formidableforms.com/defeat-spambots-honeypot-spam-protection/) - 90% effective without CAPTCHA
- [Shadcnblocks Pricing Components](https://www.shadcnblocks.com/blocks/pricing) - Ready-made pricing card patterns

### Tertiary (LOW confidence)
- [React Hook Form Common Mistakes](https://alexhooley.com/blog/react-hook-form-common-mistakes) - Pitfalls blog post (default values issue verified in multiple sources)
- [7 Ways to Reduce Form Spam](https://www.reform.app/blog/7-ways-to-reduce-form-spam-without-captcha) - Honeypot + other techniques

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified from package.json, official docs, and GitHub repos
- Architecture: HIGH - Patterns from official shadcn/ui, Convex, Resend, and React Hook Form docs
- Pitfalls: MEDIUM - Hydration errors and default values confirmed across multiple sources; conversion stats from single source

**Research date:** 2026-02-03
**Valid until:** 30 days (2026-03-05) - Stack is stable, but Convex Resend component may get updates
