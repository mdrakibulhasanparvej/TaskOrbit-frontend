import type { Metadata } from "next";
import ReportsTable from "@/components/modules/admin/ReportsTable";

export const metadata: Metadata = {
  title: "Reports | TaskOrbit Admin",
};

/** Admin reports — GET /admin/reports (totals + top projects + audit trail). */
export default function AdminReportsPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Reports
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Platform totals, top projects, and the administrative audit trail.
        </p>
      </header>
      <ReportsTable />
    </section>
  );
}
