import { useTranslations } from "next-intl";
import "./form-divider.css";

export default function FormDivider({ placeholder }: { placeholder?: string }) {
  const t = useTranslations();

  return (
    <div className="divider-wrapper">
      <span className="divider">
        {placeholder ? placeholder : t("auth.form.or")}
      </span>
    </div>
  );
}
