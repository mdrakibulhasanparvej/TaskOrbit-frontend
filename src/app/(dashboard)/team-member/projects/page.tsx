import ProjectList from "@/components/modules/project/ProjectList";

export default function TeamMemberProjectsPage() {
  return (
    <ProjectList
      canCreate={false}
      description="Projects you are a member of."
    />
  );
}
