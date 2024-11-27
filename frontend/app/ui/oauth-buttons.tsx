"use client";

import { OAUTH_LOGOS } from "@/app/components/auth/oauth-logos";
import signInWithOauth from "@/app/lib/auth/signInWithOauth";
import { oauthProviders } from "@/auth.config";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import React from "react";

export default function OauthButtons() {
  const t = useTranslations("auth");
  const handleOauthSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithOauth(e.currentTarget.id);
  };
  return (
    <div className="flex flex-col">
      {oauthProviders.map((provider) => (
        <form
          id={provider.id}
          key={provider.name}
          className="flex flex-col gap-2"
          onSubmit={handleOauthSignIn}
        >
          <button
            type="submit"
            className={clsx(
              "flex items-center justify-center",
              "bg-slate-800 text-white hover:bg-slate-300 hover:text-black",
              "dark:bg-gray-100 dark:text-slate-800",
              "p-4 rounded-xl font-bold",
            )}
          >
            {t("form.signInWith")} {provider.name}{" "}
            <span className="ml-2">{OAUTH_LOGOS[provider.name]}</span>
          </button>
        </form>
      ))}
    </div>
  );
}
