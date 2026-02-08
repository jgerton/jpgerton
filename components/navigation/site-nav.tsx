"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/65 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md transition-colors duration-[var(--duration-base)]">
      <nav aria-label="Main navigation" className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          JP Gerton
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-[var(--duration-base)] ${
                  isActive(link.href)
                    ? "text-primary after:w-full"
                    : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile area */}
        <div className="md:hidden flex items-center gap-sm">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-accent rounded-md transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <MobileMenu />
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
