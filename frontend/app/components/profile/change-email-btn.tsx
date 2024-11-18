"use client";
import clsx from "clsx";
import { User } from "next-auth";
import { useState } from "react";

type Props = { user: User };

export default function ChangeEmailBtn({ user }: Props) {
  const [isOpen, setForm] = useState(false);
  const toggleForm = () => setForm(!isOpen);
  return (
    <>
      <br />
      <button
        onClick={toggleForm}
        className={clsx(
          "text-sm font-light hover:text-gray-100 cursor-pointer justify-self-end",
          "dark:hover:text-slate-600",
        )}
      >
        cambiar email
      </button>
    </>
  );
}
