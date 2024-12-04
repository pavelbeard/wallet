import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useTranslations } from "next-intl";

type Props = { onClose: () => void };

export default function CloseModalButton({ onClose: toggleForm }: Props) {
  const t = useTranslations();
  
  return (
    <div className="flex justify-self-start">
      <button
        className={clsx(
          "flex  group gap-x-2 items-center rounded-md",
          "px-4 py-2 ml-2 mt-2 cursor-pointer",
          "hover:text-slate-600",
        )}
        onClick={toggleForm}
      >
        <XMarkIcon className="size-6" />
        <span className="group-hover:text-slate-600 text-sm">
          {t("profile.userCard.modal.close")}
        </span>
      </button>
    </div>
  );
}
