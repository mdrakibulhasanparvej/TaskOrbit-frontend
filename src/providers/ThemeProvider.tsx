"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // const scriptProps =
  //   typeof window === "undefined" ? { type: "application/json" } : undefined;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // scriptProps={scriptProps}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
