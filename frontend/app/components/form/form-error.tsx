import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

type Props = { message: string | null; [x: string]: unknown };

export default function FormError({
  message,
  testId,
  ariaLabel,
  ...rest
}: Props & { testId?: string, ariaLabel: string }) {
  if (!message) return null;

  return (
    <div
      className="flex items-center gap-x-2 rounded-xl bg-red-100/80 p-2 text-sm text-red-500"
      {...rest}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <ExclamationTriangleIcon className="size-6" />
      <p>{message}</p>
    </div>
  );
}
