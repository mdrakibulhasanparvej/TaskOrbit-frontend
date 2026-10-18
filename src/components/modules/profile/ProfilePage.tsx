"use client";

import { IconUserCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfile } from "@/hooks";
import ProfileAvatar from "./ProfileAvatar";
import UserProfileBase from "./UserProfileBase";

export default function ProfilePage() {
  const { data, isPending, isError, refetch } = useGetProfile();
  const profile = data?.data;

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner className="size-20" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="mx-auto mt-8 w-full max-w-xl">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <IconUserCircle
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <div>
            <h1 className="font-heading text-lg font-semibold">
              Profile unavailable
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn&apos;t load your profile details. Try again in a moment.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <ProfileAvatar profile={profile} />
      <UserProfileBase profile={profile} />
    </section>
  );
}
