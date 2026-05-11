import type { ReviewStatus } from '@/types/ReviewStatus';
import type { Vocabulary } from '@/types/Vocabulary';

interface ProgressIndicatorProps {
  vocabularies: Vocabulary[];
  currentIndex: number;
  statusMap: Map<string, ReviewStatus>;
  onSelect: (index: number) => void;
}

export default function ProgressIndicator({
  vocabularies,
  currentIndex,
  statusMap,
  onSelect,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {vocabularies.map((v, i) => {
        const s = statusMap.get(v.content);
        const dotColor =
          i === currentIndex
            ? 'bg-blue-500 scale-125'
            : s === 'known'
              ? 'bg-green-500'
              : s === 'unknown'
                ? 'bg-red-500'
                : 'bg-gray-300';
        return (
          <button
            key={v.content}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 sm:h-3 sm:w-3 ${dotColor}`}
            onClick={() => onSelect(i)}
          />
        );
      })}
    </div>
  );
}
