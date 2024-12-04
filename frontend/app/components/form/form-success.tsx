import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Props = { message: string | null; [x: string]: unknown };

export default function FormSuccess({
  message,
  testId,
  ariaLabel,
  ...rest
}: Props & { testId?: string; ariaLabel: string }) {
  if (!message) return null;

  return (
    <div
      aria-label={ariaLabel}
      className="justify-b flex items-center gap-x-2 rounded-xl bg-emerald-100/80 p-2 text-sm text-emerald-500"
      data-testid={testId}
      {...rest}
    >
      <CheckCircleIcon className="size-6" />
      <p>{message}</p>
    </div>
  );
}
