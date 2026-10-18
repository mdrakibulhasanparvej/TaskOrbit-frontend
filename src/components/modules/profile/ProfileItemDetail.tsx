import type { IconProps } from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export default function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="rounded-md bg-muted p-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 wrap-break-word font-medium">
          {value === null || value === undefined || value === ""
            ? "Not provided"
            : value}
        </p>
      </div>
    </div>
  );
}
