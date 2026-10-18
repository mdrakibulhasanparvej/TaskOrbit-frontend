"use client";

import { IconCamera } from "@tabler/icons-react";
import Image from "next/image";
import type { FetchError } from "ofetch";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfilePicture } from "@/hooks";
import type { UserProfile } from "@/types";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";

export default function ProfileAvatar({ profile }: { profile: UserProfile }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const { mutate: update, isPending } = useUpdateProfilePicture();
  const imageUrl = previewUrl ?? profile.profile_url ?? undefined;

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(undefined);
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const image = event.currentTarget.files?.[0];
    if (image?.type.startsWith("image/")) {
      setSelectedImage(image);
    }
    event.currentTarget.value = "";
  }

  const handleUpdatePicture = () => {
    update(selectedImage as File, {
      onSuccess: (res) => {
        triggerToast({
          type: "success",
          title: "Profile picture updated",
          description:
            res.message ||
            "Your profile picture has been updated successfully.",
        });
        setSelectedImage(null);
        setPreviewUrl(res.data);
      },
      onError: (error: FetchError) => {
        const message = error.data?.message;
        triggerToast({
          type: "error",
          title: "Update failed",
          description:
            message || "An error occurred while updating your profile picture.",
        });
      },
    });
  };

  return (
    <section className="flex flex-col items-center gap-3 py-2">
      <div className="relative max-w-[80vw] overflow-hidden rounded-full bg-muted ring-4 ring-primary/10 size-30 md:size-40">
        {imageUrl ? (
          <Image
            width={160}
            height={160}
            src={imageUrl}
            alt={profile.name}
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-5xl font-semibold text-muted-foreground">
            {getInitials(profile.name)}
          </span>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Choose a profile picture"
          className="group absolute inset-0 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-foreground/75 py-3 text-sm font-medium text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <IconCamera className="size-3.5" aria-hidden="true" />
            Change
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-label="Select a profile picture"
          onChange={(e) => handleImageChange(e)}
        />
      </div>
      {previewUrl && selectedImage && (
        <Button
          type="button"
          disabled={isPending}
          onClick={handleUpdatePicture}
        >
          {isPending && <Spinner />}
          {isPending ? "Updating..." : "Update picture"}
        </Button>
      )}
    </section>
  );
}
