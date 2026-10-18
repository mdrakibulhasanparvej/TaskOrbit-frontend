import type { Gender } from "@/types";

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "KINDER", label: "Kinder" },
  { value: "OTHER", label: "Other" },
];
