"use client";

import type { FetchError } from "ofetch";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateContactMessage } from "@/hooks";
import { createContactSchema } from "@/schemas";
import triggerToast from "@/utils/triggerToast";

const MESSAGE_MAX_LENGTH = 5000;

/**
 * Public contact form (plan.md §9 — POST /contact). Client-side validation
 * mirrors the backend zod schema (name ≤100, subject ≤150, message ≤5000).
 * A successful submit clears the form and shows a confirmation toast.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { mutate: submit, isPending } = useCreateContactMessage();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const parsed = createContactSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      triggerToast({
        type: "error",
        title: "Check the form",
        description: firstIssue
          ? `${firstIssue.path.join(".")}: ${firstIssue.message}`
          : "Please fill in every field correctly.",
      });
      return;
    }

    submit(parsed.data, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Message not sent",
            description: response.message || "Please try again.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "Message sent",
          description: "Thanks for reaching out — we'll get back to you soon.",
        });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Message not sent",
          description: error.data?.message || "Internal Server Error",
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={100}
            disabled={isPending}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isPending}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="What is this about?"
          maxLength={150}
          disabled={isPending}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us more..."
          rows={6}
          maxLength={MESSAGE_MAX_LENGTH}
          disabled={isPending}
          required
        />
        <span className="self-end text-xs text-muted-foreground">
          {message.length}/{MESSAGE_MAX_LENGTH}
        </span>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Send message
        </Button>
      </div>
    </form>
  );
}
