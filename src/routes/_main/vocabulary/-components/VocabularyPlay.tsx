import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import type { ReviewStatus } from '@/types/ReviewStatus';

import { vocabularies } from '../-mock/vocabulary';
import { statusMapAtom } from '../-store/reviewAtom';
import KeyboardHints from './play/KeyboardHints';
import ProgressIndicator from './play/ProgressIndicator';
import Stats from './play/Stats';
import VocabularyCard from './play/VocabularyCard';

export default function VocabularyPlay() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusMap, setStatusMap] = useAtom(statusMapAtom);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = vocabularies[currentIndex];
  const currentStatus = statusMap.get(current?.content) ?? null;

  const clearAutoAdvance = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  };

  const checkNavigateToSummary = (map: Map<string, ReviewStatus>) => {
    if (map.size === vocabularies.length) {
      navigate({ to: '/vocabulary/summary' });
    }
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= vocabularies.length) return;
    clearAutoAdvance();
    setCurrentIndex(index);
  };

  function handleKeydown(e: KeyboardEvent) {
    if (!current) return;

    switch (e.key) {
      // Keydown Left: mark as unknown (red), stay on current card
      case 'ArrowLeft': {
        e.preventDefault();
        clearAutoAdvance();
        setStatusMap((prev) => {
          const next = new Map(prev);
          next.set(current.content, 'unknown');
          checkNavigateToSummary(next);
          return next;
        });
        break;
      }
      // Keydown Right: mark as known (green), auto-advance to next after 1s
      case 'ArrowRight': {
        e.preventDefault();
        clearAutoAdvance();
        setStatusMap((prev) => {
          const next = new Map(prev);
          next.set(current.content, 'known');
          return next;
        });
        autoAdvanceTimer.current = setTimeout(() => {
          const nextIndex = currentIndex + 1;
          if (nextIndex >= vocabularies.length) {
            navigate({ to: '/vocabulary/summary' });
          } else {
            setCurrentIndex(nextIndex);
          }
        }, 1000);
        break;
      }
      // Keydown Up: go to previous word
      case 'ArrowUp': {
        e.preventDefault();
        goTo(currentIndex - 1);
        break;
      }
      // Keydown Down: go to next word
      case 'ArrowDown': {
        e.preventDefault();
        goTo(currentIndex + 1);
        break;
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      clearAutoAdvance();
    };
  }, [current, currentIndex]);

  const knownCount = [...statusMap.values()].filter((s) => s === 'known').length;
  const unknownCount = [...statusMap.values()].filter((s) => s === 'unknown').length;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 sm:gap-8">
      <ProgressIndicator {...{ vocabularies, currentIndex, statusMap }} onSelect={goTo} />

      {current && <VocabularyCard vocabulary={current} status={currentStatus} />}

      <KeyboardHints />

      <Stats {...{ knownCount, unknownCount, currentIndex }} total={vocabularies.length} />
    </div>
  );
}
