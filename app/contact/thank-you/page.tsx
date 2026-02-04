import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Message Sent",
  description:
    "Thanks for reaching out! I'll get back to you within 1 business day.",
  robots: { index: false }, // Don't index thank-you page
};

export default function ThankYouPage() {
  return (
    <div className="container max-w-2xl py-12">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Thanks for Reaching Out!
        </h1>
        <p className="text-lg text-muted-foreground">
          I&apos;ve received your message and will get back to you within 1 business day.
        </p>
      </div>

      {/* What Happens Next */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
              1
            </div>
            <div>
              <h4 className="font-medium">Review</h4>
              <p className="text-sm text-muted-foreground">
                I&apos;ll read through your project details and think about the best approach.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
              2
            </div>
            <div>
              <h4 className="font-medium">Response</h4>
              <p className="text-sm text-muted-foreground">
                You&apos;ll receive an email from me with next steps or follow-up questions.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
              3
            </div>
            <div>
              <h4 className="font-medium">Discussion</h4>
              <p className="text-sm text-muted-foreground">
                We&apos;ll schedule a call if needed to discuss your project in detail.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* While You Wait */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>While You Wait...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Check out some of my recent work to see what&apos;s possible:
          </p>
          <Button asChild variant="outline">
            <Link href="/projects">View My Portfolio</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Back Home */}
      <div className="text-center">
        <Button asChild variant="ghost">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
