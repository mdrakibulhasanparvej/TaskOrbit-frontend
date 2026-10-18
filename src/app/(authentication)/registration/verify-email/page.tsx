import { Suspense } from "react";
import VerifyEmail from "@/components/authentication/VerifyEmail";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-muted px-5 py-10 sm:px-6">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-10">
          <Suspense fallback={<Spinner />}>
            <VerifyEmail />
          </Suspense>

          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you confirm that you own this email address.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
