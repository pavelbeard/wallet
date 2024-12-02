import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Props = { message: string | null };

export default function FormSuccess({ message }: Props) {
  if (!message) return null;

  return (
    <div className="p-2 gap-x-2 flex justify-b items-center bg-emerald-100/80 text-emerald-500 rounded-xl text-sm">
      <CheckCircleIcon className="size-6" />
      <p>{message}</p>
    </div>
  );
}
