import useMediaBreakpoint from "./useMediaBreakpoint";

export default function useTabletBreakpoint() {
  return useMediaBreakpoint("(min-width: 500px)");
}
