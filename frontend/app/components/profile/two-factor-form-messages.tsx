export default function Messages({
  errorMessage,
  successMessage,
}: {
  errorMessage: string | null;
  successMessage: string | null;
}) {
  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  if (successMessage) {
    return <p className="text-green-500">{successMessage}</p>;
  }
}
