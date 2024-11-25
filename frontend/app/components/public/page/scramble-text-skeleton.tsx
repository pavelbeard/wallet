type Props = { className?: string; initialText: string };

export default function ScrambleTextSkeleton({
  className,
  initialText,
}: Props) {
  return <p className={className}>{initialText}</p>;
}
