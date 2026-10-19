import TeamInvitations from "@/components/modules/project/TeamInvitations";

export default function TeamMemberInvitationsPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          My Invitations
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pending project invitations sent to your email address.
        </p>
      </header>

      <TeamInvitations />
    </section>
  );
}
