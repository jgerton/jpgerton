"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileMenu } from "@/components/navigation/mobile-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  // Focus restoration: return focus to hamburger button when menu closes
  const handleClose = useCallback(() => {
    setMobileMenuOpen(false);
    // Delay focus to allow menu close transition to begin
    requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  }, []);

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
          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu - hidden on desktop via md:hidden */}
      <div className="md:hidden">
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={handleClose}
        />
      </div>
    </header>
  );
}
