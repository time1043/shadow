import type { ReviewStatus } from '@/types/ReviewStatus';
import type { Vocabulary } from '@/types/Vocabulary';

interface VocabularyCardProps {
  vocabulary: Vocabulary;
  status: ReviewStatus | null;
}

const statusStyles: Record<ReviewStatus, string> = {
  known: 'border-green-500 bg-green-50 text-green-700',
  unknown: 'border-red-500 bg-red-50 text-red-700',
};

/**
 * Vocabulary card: shows English word only by default.
 * Explanation and related words appear after the user marks the card.
 * Green border = known, red border = unknown.
 */
export default function VocabularyCard({ vocabulary, status }: VocabularyCardProps) {
  const borderClass = status ? statusStyles[status] : 'border-gray-200';
  const wordColor =
    status === 'known' ? 'text-green-600' : status === 'unknown' ? 'text-red-600' : 'text-gray-900';

  return (
    <div
      className={`relative min-h-48 w-full max-w-sm rounded-2xl border-2 p-6 shadow-lg transition-all duration-300 sm:min-h-56 sm:max-w-md sm:p-8 md:min-h-64 md:max-w-lg md:p-10 lg:max-w-xl ${borderClass}`}
    >
      <span className="absolute top-3 left-4 text-xs text-gray-400 sm:top-4 sm:left-5">
        #{vocabulary.sortOrder}
      </span>
      <div className="text-center">
        <h1 className={`mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl ${wordColor}`}>
          {vocabulary.content}
        </h1>
        {/* Show explanation only after marking */}
        {status && (
          <>
            <p className="mb-3 text-lg text-gray-600 sm:mb-4 sm:text-xl md:text-2xl">
              {vocabulary.explain}
            </p>
            {vocabulary.more && (
              <p className="text-sm text-gray-400 sm:text-base">{vocabulary.more}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
