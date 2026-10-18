import type { Metadata } from "next";
import AdminProjectTable from "@/components/modules/admin/AdminProjectTable";

export const metadata: Metadata = {
  title: "Projects | TaskOrbit Admin",
};

/** Admin project oversight — GET /admin/projects + DELETE /admin/projects/:id. */
export default function AdminProjectsPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Projects
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every project on the platform, with audited admin deletion.
        </p>
      </header>
      <AdminProjectTable />
    </section>
  );
}
