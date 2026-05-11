export default function KeyboardHints() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 sm:gap-6 sm:text-sm">
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          Space
        </kbd>{' '}
        Submit
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">←→</kbd>{' '}
        Word
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">↑↓</kbd>{' '}
        Sentence
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">Tab</kbd>{' '}
        Next
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          Ctrl+P
        </kbd>{' '}
        Pronounce
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          Ctrl+T
        </kbd>{' '}
        Translate
      </span>
      <span>
        <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-gray-600">
          Ctrl+R
        </kbd>{' '}
        Retry
      </span>
    </div>
  );
}
