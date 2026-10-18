import { toast } from "@/components/ui/toast";

interface ToastProps {
  title: string;
  description: string;
  type: "error" | "success" | "info";
}

export default function triggerToast({
  description = "Internal Server Error",
  title = "Action Failed",
  type = "error",
}: ToastProps) {
  return toast.add({
    title,
    description,
    type,
  });
}
