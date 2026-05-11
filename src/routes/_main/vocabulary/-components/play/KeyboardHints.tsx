export default function KeyboardHints() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 sm:gap-6 sm:text-sm">
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          ←
        </kbd>{' '}
        Unknown
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          →
        </kbd>{' '}
        Known
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          ↑↓
        </kbd>{' '}
        Navigate
      </span>
    </div>
  );
}
