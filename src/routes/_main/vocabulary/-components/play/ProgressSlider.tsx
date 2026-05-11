type ProgressSliderProps = {
  total: number;
  currentIndex: number;
  onJump: (index: number) => void;
};

export default function ProgressSlider({ total, currentIndex, onJump }: ProgressSliderProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-8 text-right text-xs text-gray-400">{currentIndex + 1}</span>
      <input
        type="range"
        min={0}
        max={total - 1}
        value={currentIndex}
        onChange={(e) => onJump(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-500"
      />
      <span className="w-8 text-xs text-gray-400">{total}</span>
    </div>
  );
}
