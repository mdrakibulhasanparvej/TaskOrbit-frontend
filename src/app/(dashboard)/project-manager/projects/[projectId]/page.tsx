import ProjectDetails from "@/components/modules/project/ProjectDetails";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectDetails projectId={projectId} />;
}
