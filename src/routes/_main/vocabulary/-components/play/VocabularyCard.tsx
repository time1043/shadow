import type { ReviewStatus } from '@/types/ReviewStatus';
import type { Vocabulary } from '@/types/Vocabulary';

type VocabularyCardProps = {
  vocabulary: Vocabulary;
  status: ReviewStatus | null;
  swipeOffset?: { x: number; y: number };
  onPronounce?: () => void;
};

const statusStyles: Record<ReviewStatus, string> = {
  known: 'border-green-500 bg-green-50 text-green-700',
  unknown: 'border-red-500 bg-red-50 text-red-700',
};

/**
 * Vocabulary card: shows English word only by default.
 * Explanation and related words appear after the user marks the card.
 * Green border = known, red border = unknown.
 */
export default function VocabularyCard({
  vocabulary,
  status,
  swipeOffset,
  onPronounce,
}: VocabularyCardProps) {
  const borderClass = status ? statusStyles[status] : 'border-gray-200 bg-gray-50 text-gray-900';
  const wordColor =
    status === 'known' ? 'text-green-600' : status === 'unknown' ? 'text-red-600' : 'text-gray-900';

  const transform = swipeOffset ? `translate(${swipeOffset.x}px, ${swipeOffset.y}px)` : undefined;

  return (
    <div
      className={`relative flex min-h-[50vh] w-[85vw] flex-1 flex-col items-center justify-between rounded-2xl border-2 p-8 shadow-lg sm:w-[80vw] sm:p-12 md:w-[70vw] md:p-16 lg:w-[50vw] ${borderClass}`}
      style={{
        transform,
        transition: swipeOffset ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      <span className="absolute top-4 left-5 text-sm text-gray-400 sm:top-6 sm:left-6">
        #{vocabulary.sortOrder}
      </span>

      <h1
        className={`mt-8 text-4xl font-bold sm:mt-12 sm:text-5xl md:text-6xl lg:text-7xl ${wordColor} cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          onPronounce?.();
        }}
      >
        {vocabulary.content}
      </h1>

      {/* Show explanation only after marking */}
      {status && (
        <div className="mb-8 flex flex-col items-center gap-4 sm:mb-12 sm:gap-5">
          <p className="text-xl text-gray-600 sm:text-2xl md:text-3xl">{vocabulary.explain}</p>
          {vocabulary.more && (
            <p className="text-base text-gray-400 sm:text-lg">{vocabulary.more}</p>
          )}
        </div>
      )}
    </div>
  );
}
