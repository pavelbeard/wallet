import { cookies } from "next/headers";
import { languages } from "./languages";

export default async function ChangeLanguageSkeleton() {
  const locale = cookies().get("NEXT_LOCALE");
  return (
    <div className="flex items-center justify-center gap-2 rounded-md bg-slate-100 p-2 dark:bg-slate-800">
      {languages[locale?.value as string]}
    </div>
  );
}
