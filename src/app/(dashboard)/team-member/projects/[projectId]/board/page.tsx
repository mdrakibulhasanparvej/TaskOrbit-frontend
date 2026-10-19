import KanbanBoard from "@/components/modules/task/KanbanBoard";

export default async function TeamMemberBoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <KanbanBoard projectId={projectId} readOnly />
    </section>
  );
}
