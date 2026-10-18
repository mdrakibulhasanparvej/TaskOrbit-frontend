import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Suspense fallback={<Spinner />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
