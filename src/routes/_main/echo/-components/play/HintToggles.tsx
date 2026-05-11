import PronunciationToggle from './PronunciationToggle';

type HintTogglesProps = {
  showTranslation: boolean;
  onToggleTranslation: () => void;
};

export default function HintToggles({ showTranslation, onToggleTranslation }: HintTogglesProps) {
  return (
    <div className="flex items-center gap-3">
      <PronunciationToggle />
      <button
        onClick={onToggleTranslation}
        className={`rounded-full px-3 py-1.5 text-sm ${showTranslation ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
        title="Toggle Chinese translation"
      >
        译
      </button>
    </div>
  );
}
