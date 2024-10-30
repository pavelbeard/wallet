import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function AuthQuestion({
  href,
  type,
}: {
  href: string;
  type: "with-account" | "without-account";
}) {
  const t = useTranslations('auth')
  const locale = useLocale();
  return (
    <div className="p-2">
      <Link href={href} locale={locale}>
        {type === "with-account" && t('form.withAccount')}
        {type === "without-account" && t('form.withoutAccount')}
      </Link>
    </div>
  );
}
