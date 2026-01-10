export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-200px)]">
      <div className="relative flex flex-col items-center">
        <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-primary mt-3">Loading...</p>
      </div>
    </div>
  );
}