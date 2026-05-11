import type { ReviewStatus } from '@/types/ReviewStatus';
import type { Vocabulary } from '@/types/Vocabulary';

interface ProgressIndicatorProps {
  vocabularies: Vocabulary[];
  currentIndex: number;
  statusMap: Map<string, ReviewStatus>;
  onSelect: (index: number) => void;
}

const WINDOW_SIZE = 9;

export default function ProgressIndicator({
  vocabularies,
  currentIndex,
  statusMap,
  onSelect,
}: ProgressIndicatorProps) {
  const total = vocabularies.length;

  if (total <= WINDOW_SIZE) {
    return (
      <div className="flex items-center gap-2">
        {vocabularies.map((v, i) => (
          <Dot
            key={v.content}
            status={statusMap.get(v.content)}
            active={i === currentIndex}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    );
  }

  const half = Math.floor(WINDOW_SIZE / 2);
  let start = currentIndex - half;
  let end = currentIndex + half;

  if (start < 0) {
    start = 0;
    end = WINDOW_SIZE - 1;
  } else if (end >= total) {
    end = total - 1;
    start = total - WINDOW_SIZE;
  }

  const showLeftEllipsis = start > 0;
  const showRightEllipsis = end < total - 1;

  return (
    <div className="flex items-center gap-2">
      {showLeftEllipsis && (
        <button className="px-1 text-xs text-gray-400" onClick={() => onSelect(0)}>
          …
        </button>
      )}
      {vocabularies.slice(start, end + 1).map((v, i) => {
        const realIndex = start + i;
        return (
          <Dot
            key={v.content}
            status={statusMap.get(v.content)}
            active={realIndex === currentIndex}
            onClick={() => onSelect(realIndex)}
          />
        );
      })}
      {showRightEllipsis && (
        <button className="px-1 text-xs text-gray-400" onClick={() => onSelect(total - 1)}>
          …
        </button>
      )}
    </div>
  );
}

function Dot({
  status,
  active,
  onClick,
}: {
  status: ReviewStatus | undefined;
  active: boolean;
  onClick: () => void;
}) {
  const dotColor = active
    ? 'bg-blue-500 scale-125'
    : status === 'known'
      ? 'bg-green-500'
      : status === 'unknown'
        ? 'bg-red-500'
        : 'bg-gray-300';

  return (
    <button
      className={`h-2.5 w-2.5 rounded-full transition-all duration-200 sm:h-3 sm:w-3 ${dotColor}`}
      onClick={onClick}
    />
  );
}
