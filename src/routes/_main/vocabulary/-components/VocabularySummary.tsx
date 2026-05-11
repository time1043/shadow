import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';

import { vocabularies } from '../-mock/vocabulary';
import { statusMapAtom } from '../-store/reviewAtom';

export default function VocabularySummary() {
  const navigate = useNavigate();

  const [statusMap, setStatusMap] = useAtom(statusMapAtom);

  const knownCount = [...statusMap.values()].filter((s) => s === 'known').length;
  const unknownCount = [...statusMap.values()].filter((s) => s === 'unknown').length;

  const knownWords = vocabularies.filter((v) => statusMap.get(v.content) === 'known');
  const unknownWords = vocabularies.filter((v) => statusMap.get(v.content) === 'unknown');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">Review Complete</h2>

      <div className="flex gap-6 text-lg sm:text-xl">
        <span className="font-semibold text-green-600">Known: {knownCount}</span>
        <span className="font-semibold text-red-600">Unknown: {unknownCount}</span>
      </div>

      {unknownWords.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="mb-3 text-lg font-semibold text-red-600">Unknown Words</h3>
          <div className="space-y-2">
            {unknownWords.map((v) => (
              <div
                key={v.content}
                className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
              >
                <span className="font-medium text-red-700">{v.content}</span>
                <span className="text-sm text-red-500">{v.explain}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {knownWords.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="mb-3 text-lg font-semibold text-green-600">Known Words</h3>
          <div className="space-y-2">
            {knownWords.map((v) => (
              <div
                key={v.content}
                className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3"
              >
                <span className="font-medium text-green-700">{v.content}</span>
                <span className="text-sm text-green-500">{v.explain}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        onClick={() => {
          setStatusMap(new Map());
          navigate({ to: '/vocabulary' });
        }}
      >
        Review Again
      </button>
    </div>
  );
}
