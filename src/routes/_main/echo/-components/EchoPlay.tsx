import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';

import { useSpeech } from '@/hooks/useSpeech';

import {
  currentLineAtom,
  currentLineIndexAtom,
  deleteLastCharAtom,
  focusedWordIndexAtom,
  initializeWordStatesAtom,
  jumpToSentenceAtom,
  moveFocusAtom,
  nextSentenceAtom,
  previousSentenceAtom,
  pronunciationEnabledAtom,
  retrySentenceAtom,
  sentenceStatusesAtom,
  setFocusedWordAtom,
  showTranslationAtom,
  submitCurrentWordAtom,
  tokensAtom,
  totalLinesAtom,
  totalWordsAtom,
  updateCurrentWordInputAtom,
  wordStatesAtom,
} from '../-store/echo';
import HintToggles from './play/HintToggles';
import KeyboardHints from './play/KeyboardHints';
import ProgressIndicator from './play/ProgressIndicator';
import ProgressSlider from './play/ProgressSlider';
import WordCell from './WordCell';

export default function EchoPlay() {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const line = useAtomValue(currentLineAtom);
  const tokens = useAtomValue(tokensAtom);
  const wordStates = useAtomValue(wordStatesAtom);
  const focusedIndex = useAtomValue(focusedWordIndexAtom);
  const totalWords = useAtomValue(totalWordsAtom);
  const lineIndex = useAtomValue(currentLineIndexAtom);
  const totalLines = useAtomValue(totalLinesAtom);
  const sentenceStatuses = useAtomValue(sentenceStatusesAtom);

  const [showTranslation, setShowTranslation] = useAtom(showTranslationAtom);
  const pronunciationEnabled = useAtomValue(pronunciationEnabledAtom);

  const initialize = useSetAtom(initializeWordStatesAtom);
  const jumpToSentence = useSetAtom(jumpToSentenceAtom);
  const submitWord = useSetAtom(submitCurrentWordAtom);
  const updateInput = useSetAtom(updateCurrentWordInputAtom);
  const deleteChar = useSetAtom(deleteLastCharAtom);
  const moveFocus = useSetAtom(moveFocusAtom);
  const setFocused = useSetAtom(setFocusedWordAtom);
  const nextSentence = useSetAtom(nextSentenceAtom);
  const prevSentence = useSetAtom(previousSentenceAtom);
  const retrySentence = useSetAtom(retrySentenceAtom);

  const { speak } = useSpeech();

  // Initialize first sentence on mount
  useEffect(() => {
    initialize();
  }, []);

  // Auto-focus hidden input
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, [lineIndex]);

  // Pronounce on sentence load
  useEffect(() => {
    if (pronunciationEnabled && line) {
      speak(line.content);
    }
  }, [lineIndex, pronunciationEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+key shortcuts
    if (e.ctrlKey && !e.metaKey) {
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (line) speak(line.content);
        return;
      }
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setShowTranslation((v) => !v);
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        retrySentence();
        return;
      }
    }

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        submitWord();
        break;
      case 'ArrowUp':
        e.preventDefault();
        prevSentence();
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextSentence();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus('prev');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus('next');
        break;
      case 'Tab':
        e.preventDefault();
        moveFocus(e.shiftKey ? 'prev' : 'next');
        break;
      case 'Backspace':
        e.preventDefault();
        deleteChar();
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          updateInput(e.key);
        }
    }
  };

  const handleWordClick = (index: number) => {
    setFocused(index);
    hiddenInputRef.current?.focus();
  };

  if (!line) return null;

  // Build word index mapping for click handlers
  let wordIdx = 0;

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6"
      onClick={() => hiddenInputRef.current?.focus()}
    >
      {/* Hidden input for keyboard capture */}
      <input
        ref={hiddenInputRef}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        value=""
        aria-label="Type words here"
        autoFocus
      />

      {/* Progress slider for sentence navigation */}
      <ProgressSlider total={totalLines} currentIndex={lineIndex} onJump={jumpToSentence} />
      {/* Sentence progress indicator */}
      <ProgressIndicator
        statuses={sentenceStatuses}
        currentIndex={lineIndex}
        onSelect={(i) => {
          jumpToSentence(i);
          hiddenInputRef.current?.focus();
        }}
      />

      {/* Hint toggles */}
      <HintToggles
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((v) => !v)}
      />

      {/* Chinese translation hint */}
      {showTranslation && (
        <p className="text-center text-base text-gray-500 sm:text-lg">{line.translation}</p>
      )}

      {/* Sentence tokens */}
      <div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-4 px-4 sm:gap-x-4">
        {tokens.map((token, i) => {
          if (token.type === 'punct') {
            return (
              <span key={i} className="self-end pb-1 text-xl text-gray-400 sm:text-2xl">
                {token.text}
              </span>
            );
          }

          const thisWordIdx = wordIdx++;
          const state = wordStates[thisWordIdx] ?? {
            userInput: '',
            status: 'empty' as const,
          };

          return (
            <WordCell
              key={i}
              word={token.text}
              state={state}
              isFocused={thisWordIdx === focusedIndex}
              onClick={() => handleWordClick(thisWordIdx)}
            />
          );
        })}
      </div>

      {/* Progress text */}
      <p className="text-sm text-gray-400">
        Word {Math.min(focusedIndex + 1, totalWords)} / {totalWords}
      </p>

      {/* Keyboard hints */}
      <KeyboardHints />
    </div>
  );
}
