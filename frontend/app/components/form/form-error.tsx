import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

type Props = { message: string | null };

export default function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <div className="p-4 gap-x-2 flex items-center bg-red-100/80 text-red-500 rounded-xl text-sm">
      <ExclamationTriangleIcon className="size-6" />
      <p>{message}</p>
    </div>
  );
}
