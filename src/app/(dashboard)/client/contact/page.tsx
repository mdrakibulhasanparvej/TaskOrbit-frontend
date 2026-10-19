import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import type { Metadata } from "next";
import ContactForm from "@/components/modules/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | TaskOrbit",
};

/** Client contact page — posts to POST /contact (the admin inbox). */
export default function ClientContactPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Contact us
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about your subscription or billing? Send us a message and
          the team will get back to you.
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
    </section>
  );
}
