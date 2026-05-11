import { useAtom } from 'jotai';

import { pronunciationEnabledAtom } from '../../-store/echo';

export default function PronunciationToggle() {
  const [enabled, setEnabled] = useAtom(pronunciationEnabledAtom);

  return (
    <button
      onClick={() => setEnabled((prev) => !prev)}
      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      title={enabled ? 'Disable pronunciation' : 'Enable pronunciation'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}
