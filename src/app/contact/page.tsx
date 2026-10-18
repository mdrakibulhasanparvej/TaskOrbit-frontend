import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import type { Metadata } from "next";
import ContactForm from "@/components/modules/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | TaskOrbit",
  description: "Get in touch with the TaskOrbit team.",
};

/** Public contact page — submits to POST /contact (no auth required). */
export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Contact us
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Questions, feedback, or partnership ideas — drop us a message and the
          team will get back to you.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <IconMail
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                support@taskorbit.dev
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconPhone
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (555) 010-0199</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconMapPin
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium">Office</p>
              <p className="text-sm text-muted-foreground">
                100 Innovation Drive, Suite 400
                <br />
                San Francisco, CA 94107
              </p>
            </div>
          </div>
        </aside>

        <div className="rounded-xl border bg-card p-6 lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
