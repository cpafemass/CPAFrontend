interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div
      className="rounded-lg border border-blue-100 bg-blue-50 p-6 text-center text-sm font-bold text-slate-700"
      role="status"
      aria-live="polite"
    >
      <span className="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
      {message}
    </div>
  );
}
