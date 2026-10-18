import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </QueryProvider>
  );
}
