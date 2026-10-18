import { IconArrowLeft, IconShieldLock } from "@tabler/icons-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <section className=" min-h-screen flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex size-24 items-center justify-center rounded-3xl border border-primary/15 bg-primary/5 text-primary shadow-sm">
          <span className="absolute inset-2 rounded-2xl border border-primary/10" />
          <IconShieldLock
            aria-hidden="true"
            className="relative size-10"
            stroke={1.5}
          />
        </div>

        <p className="mb-3 font-mono text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Error 403
        </p>
        <h1
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          id="access-denied-title"
        >
          This area is restricted
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          You don&apos;t have access to this resource. If you think this is a
          mistake, contact your administrator.
        </p>

        <Link
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href="/login"
        >
          <IconArrowLeft aria-hidden="true" className="size-4" />
          Return to Login
        </Link>
      </div>
    </section>
  );
}
