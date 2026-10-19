import ProjectEdit from "@/components/modules/project/ProjectEdit";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectEdit projectId={projectId} />;
}
