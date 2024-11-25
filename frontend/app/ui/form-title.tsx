import clsx from "clsx";
import React from "react";

type Props = {
  textSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
};

export default function FormTitle({ textSize = "2xl", children }: Props) {
  const text = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };
  return <h1 className={clsx(text[textSize], "px-2 font-bold")}>{children}</h1>;
}
