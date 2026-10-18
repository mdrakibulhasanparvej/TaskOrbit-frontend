import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/shared/Logo";

export default function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="TaskOrbit home">
            <Logo />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 border-b pb-8">
          <p className="text-sm font-medium text-primary">TaskOrbit</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Last updated: October 9, 2026
          </p>
        </header>

        <article className="space-y-8 text-sm leading-7 text-foreground/85 [&_h2]:mb-2 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </article>
      </div>

      <footer className="border-t">
        <nav
          aria-label="Legal"
          className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-2 px-4 py-5 text-sm text-muted-foreground sm:px-6"
        >
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-foreground">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}
