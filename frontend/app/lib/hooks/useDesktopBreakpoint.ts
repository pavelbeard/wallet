import useMediaBreakpoint from "./useMediaBreakpoint";

export default function useDesktopBreakpoint() {
  const matches = useMediaBreakpoint("(min-width: 1024px)");
  console.log("useDesktopBreakpoint", matches);
  return matches;
}
