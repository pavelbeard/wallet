"use client";

import signInWithOauth from "@/app/lib/signInWithOauth";
import { IoLogoGoogle } from "@react-icons/all-files/io/IoLogoGoogle";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

export default function GoogleButton() {
  const t = useTranslations("auth");
  return (
    <form
      className="p-4 flex flex-col gap-2"
      action={async () => signInWithOauth("google")}
    >
      <button
        type="submit"
        className={clsx(
          "flex justify-center",
          "bg-slate-800 text-white hover:bg-slate-300 hover:text-black",
          "p-4 rounded-xl font-bold",
        )}
      >
        {t("form.signInWith")} Google{" "}
        <IoLogoGoogle className="ml-2 size-6 justify-self-center" />
      </button>
    </form>
  );
}
