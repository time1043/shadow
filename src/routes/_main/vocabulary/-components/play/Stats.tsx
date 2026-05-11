type StatsProps = {
  knownCount: number;
  unknownCount: number;
  currentIndex: number;
  total: number;
};

export default function Stats({ knownCount, unknownCount, currentIndex, total }: StatsProps) {
  return (
    <div className="flex gap-4 text-sm text-gray-500">
      <span className="text-green-600">✓ {knownCount}</span>
      <span className="text-red-600">✗ {unknownCount}</span>
      <span>
        {currentIndex + 1}/{total}
      </span>
    </div>
  );
}
