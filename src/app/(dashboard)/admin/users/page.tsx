import type { Metadata } from "next";
import UserTable from "@/components/modules/admin/UserTable";

export const metadata: Metadata = {
  title: "Users | TaskOrbit Admin",
};

/** Admin user management — GET /admin/users + status/role mutations. */
export default function AdminUsersPage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Users
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search the platform directory, suspend or restore accounts, and change
          roles.
        </p>
      </header>
      <UserTable />
    </section>
  );
}
