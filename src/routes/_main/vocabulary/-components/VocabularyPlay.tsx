import { useNavigate } from '@tanstack/react-router';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import type { ReviewStatus } from '@/types/ReviewStatus';

import { useSpeech } from '@/hooks/useSpeech';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { vocabularies } from '@/mock/vocabulary';

import { pronunciationEnabledAtom } from '../-store/pronunciationAtom';
import { statusMapAtom } from '../-store/reviewAtom';
import KeyboardHints from './play/KeyboardHints';
import ProgressIndicator from './play/ProgressIndicator';
import ProgressSlider from './play/ProgressSlider';
import PronunciationToggle from './play/PronunciationToggle';
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

  // Swipe left: mark as unknown
  const handleSwipeLeft = () => {
    if (!current) return;
    clearAutoAdvance();
    setStatusMap((prev) => {
      const next = new Map(prev);
      next.set(current.content, 'unknown');
      checkNavigateToSummary(next);
      return next;
    });
  };

  // Swipe right: mark as known, auto-advance after 1s
  const handleSwipeRight = () => {
    if (!current) return;
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
    }, 800);
  };

  const { offset, onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: () => goTo(currentIndex + 1),
    onSwipeDown: () => goTo(currentIndex - 1),
  });

  // Keyboard handling
  function handleKeydown(e: KeyboardEvent) {
    if (!current) return;

    switch (e.key) {
      // Keydown Left: mark as unknown (red), stay on current card
      case 'ArrowLeft': {
        e.preventDefault();
        handleSwipeLeft();
        break;
      }
      // Keydown Right: mark as known (green), auto-advance to next after 1s
      case 'ArrowRight': {
        e.preventDefault();
        handleSwipeRight();
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

  // Auto-pronounce when word changes
  const pronunciationEnabled = useAtomValue(pronunciationEnabledAtom);
  const { speak } = useSpeech();

  useEffect(() => {
    if (pronunciationEnabled && current) {
      speak(current.content);
    }
  }, [currentIndex, pronunciationEnabled]);

  const knownCount = [...statusMap.values()].filter((s) => s === 'known').length;
  const unknownCount = [...statusMap.values()].filter((s) => s === 'unknown').length;

  return (
    <div className="flex h-[90vh] w-full flex-col items-center justify-between py-4">
      <div className="flex w-full flex-col items-center gap-3">
        <ProgressSlider total={vocabularies.length} {...{ currentIndex }} onJump={goTo} />
        <div className="flex items-center justify-center gap-4">
          <ProgressIndicator {...{ vocabularies, currentIndex, statusMap }} onSelect={goTo} />
          <Stats {...{ knownCount, unknownCount, currentIndex }} total={vocabularies.length} />
          <PronunciationToggle />
        </div>
      </div>

      {current && (
        <div {...{ onTouchStart, onTouchMove, onTouchEnd }} className="touch-none">
          <VocabularyCard
            vocabulary={current}
            status={currentStatus}
            swipeOffset={offset}
            onPronounce={pronunciationEnabled ? () => speak(current.content) : undefined}
          />
        </div>
      )}

      <KeyboardHints />
    </div>
  );
}
