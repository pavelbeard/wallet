"use client";

import useScrambleText from "@/app/lib/hooks/useScrambleText";

export default function ScrambleText({
  initialText,
  textArray,
  className,
  upperCase = false,
  lowerCase = false,
}: {
  initialText: string;
  textArray: string[];
  className?: string;
  upperCase?: boolean;
  lowerCase?: boolean;
}) {
  let initText: string;
  let textArr: string[];
  if (upperCase) {
    initText = initialText.toUpperCase();
    textArr = textArray.map((t) => t.toUpperCase());
  } else if (lowerCase) {
    initText = initialText.toLowerCase();
    textArr = textArray.map((t) => t.toLowerCase());
  } else {
    initText = initialText;
    textArr = textArray;
  }

  const ref = useScrambleText(initText, textArr);
  return <p className={className} ref={ref} />;
}
