"use client";

import Card from "@/app/ui/card";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

enum ErrorType {
  AccessDenied = "AccessDenied",
  UserExistsError = "UserExistsError",
  Configuration = "Configuration",
}

export default function AuthError() {
  const t = useTranslations()
  const search = useSearchParams();
  const error = search.get("error");

  const errorMap: { [x: string]: string } = {
    [ErrorType.AccessDenied]: "auth.errors.accessDenied",
    [ErrorType.Configuration]: "auth.errors.configuration",
  };

  const errorMessage: { [x: string]: string } = {
    [ErrorType.AccessDenied]: "auth.errors.accessDeniedMessage",
    [ErrorType.Configuration]: "auth.errors.configurationMessage",
  };
  
  const errorTitle = t(errorMap[error as string]);

  const msg = t(errorMessage[error as string]);

  return (
    <Card className="p-4">
      <div className="flex flex-col text-red-500">
        <h1>{errorTitle}</h1>
        <p className="text-sm w-32 mt-2">{msg}</p>
      </div>
    </Card>
  );
}
