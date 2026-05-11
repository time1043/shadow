import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';

import { useSpeech } from '@/hooks/useSpeech';

import {
  currentLineAtom,
  currentLineIndexAtom,
  correctCountAtom,
  deleteLastCharAtom,
  focusedWordIndexAtom,
  initializeWordStatesAtom,
  isSentenceCompleteAtom,
  moveFocusAtom,
  nextSentenceAtom,
  previousSentenceAtom,
  pronunciationEnabledAtom,
  retrySentenceAtom,
  setFocusedWordAtom,
  showTranslationAtom,
  submitCurrentWordAtom,
  tokensAtom,
  totalWordsAtom,
  updateCurrentWordInputAtom,
  wordStatesAtom,
} from '../-store/echo';
import WordCell from './WordCell';

export default function EchoPlay() {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const line = useAtomValue(currentLineAtom);
  const tokens = useAtomValue(tokensAtom);
  const wordStates = useAtomValue(wordStatesAtom);
  const focusedIndex = useAtomValue(focusedWordIndexAtom);
  const isComplete = useAtomValue(isSentenceCompleteAtom);
  const correctCount = useAtomValue(correctCountAtom);
  const totalWords = useAtomValue(totalWordsAtom);
  const lineIndex = useAtomValue(currentLineIndexAtom);

  const [showTranslation, setShowTranslation] = useAtom(showTranslationAtom);
  const [pronunciationEnabled, setPronunciationEnabled] = useAtom(pronunciationEnabledAtom);

  const initialize = useSetAtom(initializeWordStatesAtom);
  const submitWord = useSetAtom(submitCurrentWordAtom);
  const updateInput = useSetAtom(updateCurrentWordInputAtom);
  const deleteChar = useSetAtom(deleteLastCharAtom);
  const moveFocus = useSetAtom(moveFocusAtom);
  const setFocused = useSetAtom(setFocusedWordAtom);
  const nextSentence = useSetAtom(nextSentenceAtom);
  const prevSentence = useSetAtom(previousSentenceAtom);
  const retrySentence = useSetAtom(retrySentenceAtom);

  const { speak } = useSpeech();

  // Initialize word states when line changes
  useEffect(() => {
    initialize();
  }, [initialize, lineIndex]);

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

  const handleRetry = () => {
    retrySentence();
    hiddenInputRef.current?.focus();
  };

  const handleNext = () => {
    nextSentence();
    hiddenInputRef.current?.focus();
  };

  if (!line) return null;

  const hasNextSentence = lineIndex < 6 - 1; // mock data count

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

      {/* Hint toggles */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPronunciationEnabled((v) => !v);
          }}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Toggle pronunciation"
        >
          {pronunciationEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTranslation((v) => !v);
          }}
          className={`rounded-full px-3 py-1.5 text-sm ${showTranslation ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
          title="Toggle Chinese translation"
        >
          译
        </button>
      </div>

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

      {/* Progress */}
      <p className="text-sm text-gray-400">
        Word {Math.min(focusedIndex + 1, totalWords)} / {totalWords}
      </p>

      {/* Completion summary */}
      {isComplete && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold">
            {correctCount} / {totalWords} correct
          </p>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Retry
            </button>
            {hasNextSentence && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                Next Sentence
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
