import { useTranslations } from "next-intl";
import "./form-divider.css";

export default function FormDivider() {
  const t = useTranslations("auth");

  return (
    <div className="divider-wrapper">
      <span className="divider">{t("form.or")}</span>
    </div>
  );
}
