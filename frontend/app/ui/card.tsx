import React from "react";

type CardProps = { children: React.ReactNode };

export default function Card({ children }: CardProps) {
  return (
    <div className="shadow-black drop-shadow-2xl bg-white rounded-xl p-6 my-12 w-3/4 lg:w-1/3">
      {children}
    </div>
  );
}
