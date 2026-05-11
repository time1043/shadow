import type { SentenceStatus } from '../../-store/echo';

type ProgressIndicatorProps = {
  statuses: SentenceStatus[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export default function ProgressIndicator({
  statuses,
  currentIndex,
  onSelect,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {statuses.map((status, i) => (
        <Dot
          key={i}
          status={status}
          active={i === currentIndex}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

function Dot({
  status,
  active,
  onClick,
}: {
  status: SentenceStatus;
  active: boolean;
  onClick: () => void;
}) {
  const dotColor = active
    ? 'bg-blue-500 scale-125'
    : status === 'completed'
      ? 'bg-green-500'
      : status === 'attempted'
        ? 'bg-red-500'
        : 'bg-gray-300';

  return (
    <button
      className={`h-2.5 w-2.5 rounded-full transition-all duration-200 sm:h-3 sm:w-3 ${dotColor}`}
      onClick={onClick}
    />
  );
}
