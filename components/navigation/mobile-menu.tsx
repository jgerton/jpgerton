"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <SheetContent side="right" className="w-3/4 max-w-sm">
      <SheetHeader className="sr-only">
        <SheetTitle>Navigation</SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col gap-md pt-lg">
        {navLinks.map((link) => (
          <SheetClose asChild key={link.href}>
            <Link
              href={link.href}
              className={`text-lg font-medium transition-colors hover:text-primary py-1 ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          </SheetClose>
        ))}
      </nav>
    </SheetContent>
  );
}
