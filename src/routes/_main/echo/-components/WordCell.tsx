import type { WordState } from '../-store/echo';

type WordCellProps = {
  word: string;
  state: WordState;
  isFocused: boolean;
  onClick: () => void;
};

const cellColors: Record<string, string> = {
  correct: 'border-green-500 bg-green-50 text-green-700',
  incorrect: 'border-red-500 bg-red-50 text-red-700',
  'empty-focused': 'border-blue-400 bg-blue-50 text-gray-900',
  'empty-unfocused': 'border-gray-300 bg-white text-gray-900',
};

function getCellKey(status: string, isFocused: boolean): string {
  if (status === 'correct') return 'correct';
  if (status === 'incorrect') return 'incorrect';
  return isFocused ? 'empty-focused' : 'empty-unfocused';
}

export default function WordCell({ word, state, isFocused, onClick }: WordCellProps) {
  // Show at least the expected word length, expand if user typed more
  const displayLength = Math.max(word.length, state.userInput.length);
  const inputChars = state.userInput.split('');

  const focusRing =
    isFocused && state.status === 'empty'
      ? 'ring-2 ring-blue-400 rounded-lg'
      : '';

  return (
    <div
      className={`inline-flex cursor-pointer items-end gap-0.5 px-1 py-0.5 ${focusRing}`}
      onClick={onClick}
    >
      {Array.from({ length: displayLength }, (_, i) => {
        const typed = inputChars[i];
        const isEmpty = typed === undefined;
        const key = getCellKey(state.status, isFocused);
        const colors = isEmpty ? cellColors['empty-unfocused'] : cellColors[key];

        return (
          <div
            key={i}
            className={`flex h-9 w-7 items-center justify-center rounded border-2 font-mono text-base font-semibold sm:h-10 sm:w-8 sm:text-lg ${colors}`}
          >
            {typed ?? '_'}
          </div>
        );
      })}
    </div>
  );
}
