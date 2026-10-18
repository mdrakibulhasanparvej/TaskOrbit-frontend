import type { Metadata } from "next";
import PlatformSettingsForm from "@/components/modules/admin/PlatformSettingsForm";

export const metadata: Metadata = {
  title: "Settings | TaskOrbit Admin",
};

/** Admin platform settings — GET/PATCH /admin/settings. */
export default function AdminSettingsPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Platform-wide toggles: maintenance mode, registration, and the support
          inbox.
        </p>
      </header>
      <PlatformSettingsForm />
    </section>
  );
}
