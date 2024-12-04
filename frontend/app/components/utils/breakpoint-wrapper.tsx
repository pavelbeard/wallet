"use client";

import useMediaBreakpoint from "@/app/lib/hooks/useMediaBreakpoint";

export default function BreakpointWrapper({
  query,
  children,
}: {
  query: string;
  children: React.ReactNode;
}) {
  const isMobile = useMediaBreakpoint(query);
  if (isMobile) {
    return <>{children}</>;
  }
}
