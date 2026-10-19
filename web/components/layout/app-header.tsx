"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "cn";

export interface NavLink {
  href: string;
  label: string;
}

export function AppHeader({
  links,
  homeHref,
}: {
  links: NavLink[];
  homeHref: string;
}) {
  const pathname = usePathname();
  // The menu is "open for" one pathname, so it closes by itself after navigating.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  // Exact match, or a deeper route that no other link matches more specifically.
  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (!pathname.startsWith(`${href}/`)) return false;
    return !links.some(
      (other) =>
        other.href !== href &&
        other.href.startsWith(`${href}/`) &&
        (pathname === other.href || pathname.startsWith(`${other.href}/`)),
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Brand href={homeHref} />
          <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 transition-colors",
                  isActive(link.href)
                    ? "bg-brand-soft font-medium text-brand"
                    : "text-neutral-500 hover:text-brand",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SignOutButton />
          </div>
          <button
            type="button"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full text-brand hover:bg-brand-soft md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-black/5 bg-white md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm",
                  isActive(link.href)
                    ? "bg-brand-soft font-medium text-brand"
                    : "text-neutral-600 hover:bg-brand-soft",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <SignOutButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
