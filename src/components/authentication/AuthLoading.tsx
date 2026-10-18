import { IconLoader } from "@tabler/icons-react";

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string;
}) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex gap-3 items-center">
        <IconLoader className="size-6 animate-spin"></IconLoader>
        <p>{label}</p>
      </div>
    </div>
  );
}
