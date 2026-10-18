import { IconArrowLeft, IconCompass } from "@tabler/icons-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border bg-muted text-muted-foreground">
        <IconCompass className="size-7" stroke={1.6} aria-hidden="true" />
      </div>
      <p className="font-mono text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        Error 404
      </p>
      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Check the address, or return to the home page.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          <IconArrowLeft aria-hidden="true" />
          Go to home
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Sign in
        </Link>
      </div>
    </section>
  );
}
