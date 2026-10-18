import AuthGuard from "@/components/authentication/AuthGuard";

export default function Home() {
  return <AuthGuard redirectAuthenticatedUser />;
}
