"use client";
import { IconMail } from "@tabler/icons-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { useResendOtp, useVerifyEmail } from "@/hooks";
import triggerToast from "@/utils/triggerToast";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [errMessage, setErrmessage] = useState("");
  const router = useRouter();

  const { mutate: verify, isPending } = useVerifyEmail();
  const { mutate: resendOtp } = useResendOtp();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    return (
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          No email found
        </h1>
      </div>
    );
  }

  const handleOTPSubmit = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      setErrmessage("Invalid OTP length");
      return;
    }

    const data = {
      email,
      otp,
    };

    verify(data, {
      onSuccess: (res) => {
        if (!res.success) {
          setIsInvalid(true);
          setErrmessage(res.message);
        }
        triggerToast({
          type: "success",
          title: "Verification successful",
          description:
            "Welcome to TaskOrbit. Please select your workspace to proceed",
        });
        router.push(`/login`);
      },
      onError: (err: FetchError) => {
        const message = err.data?.message;
        setIsInvalid(true);
        setErrmessage(message);
      },
    });
  };

  const handleResendOtp = () => {
    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          if (!res.success) {
            triggerToast({
              type: "error",
              title: "Could not resend code",
              description: res.message || "Internal Server Error",
            });
            return;
          }
          triggerToast({
            type: "success",
            title: "Code resent",
            description:
              res.message || "A new 6-digit code has been sent to your email.",
          });
        },
        onError: (err: FetchError) => {
          triggerToast({
            type: "error",
            title: "Could not resend code",
            description: err.data?.message || "Internal Server Error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <IconMail size={28} stroke={1.8} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Verify your email
      </h1>
      <p className="mt-2 mb-4 max-w-sm text-sm leading-6 text-muted-foreground">
        Enter the 6-digit code we sent to
        <span className="mt-1 block font-medium text-foreground">
          {email || "your email address"}
        </span>
        to continue
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOTPSubmit();
        }}
      >
        <InputOTP
          id="otp"
          name="otp"
          value={otp}
          onChange={(e) => {
            setOtp(e);
            setErrmessage("");
            setIsInvalid(false);
          }}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup className="gap-2 justify-center">
            <InputOTPSlot
              index={0}
              aria-invalid={isInvalid}
              className="size-12 rounded-lg border bg-background text-lg font-semibold first:border-l"
            />
            <InputOTPSlot
              index={1}
              aria-invalid={isInvalid}
              className="size-12 rounded-lg border bg-background text-lg font-semibold"
            />
            <InputOTPSlot
              index={2}
              aria-invalid={isInvalid}
              className="size-12 rounded-lg border bg-background text-lg font-semibold"
            />
            <InputOTPSlot
              index={3}
              aria-invalid={isInvalid}
              className="size-12 rounded-lg border bg-background text-lg font-semibold"
            />
            <InputOTPSlot
              index={4}
              aria-invalid={isInvalid}
              className="size-12 rounded-lg border bg-background text-lg font-semibold"
            />
            <InputOTPSlot
              index={5}
              aria-invalid={isInvalid}
              className="size-12 rounded-lg border bg-background text-lg font-semibold last:border-r"
            />
          </InputOTPGroup>
        </InputOTP>

        {isInvalid && <FieldError className="mt-4">{errMessage}</FieldError>}

        <Button className={"w-full mt-4"} disabled={isPending} type="submit">
          {isPending && <Spinner />}
          {isPending ? "Verifying.." : "Verify Email "}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        <button
          type="button"
          onClick={handleResendOtp}
          className="font-medium text-primary hover:underline"
        >
          Resend code
        </button>
      </p>
    </div>
  );
}
