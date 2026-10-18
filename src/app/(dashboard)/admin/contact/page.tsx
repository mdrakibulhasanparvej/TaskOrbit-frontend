import type { Metadata } from "next";
import ContactList from "@/components/modules/contact/ContactList";

export const metadata: Metadata = {
  title: "Contact Inbox | TaskOrbit Admin",
};

/** Admin contact inbox — GET /contact + PATCH /contact/:id (status). */
export default function AdminContactPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Contact inbox
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Messages from the public contact page, with read/resolved tracking.
        </p>
      </header>
      <ContactList />
    </section>
  );
}
