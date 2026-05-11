import { atom } from 'jotai';

import { echoLines } from '@/mock/echo';

export type WordStatus = 'empty' | 'correct' | 'incorrect';
export type WordState = {
  userInput: string;
  status: WordStatus;
};
export type Token = {
  text: string;
  type: 'word' | 'punct';
};
export type SentenceStatus = 'current' | 'completed' | 'attempted' | 'not-started';

// --- Helpers ---

const PUNCT_RE = /^[.,;:!?]+$/;

export function tokenizeSentence(content: string): Token[] {
  const raw = content.split(/\s+/);
  const tokens: Token[] = [];
  for (const piece of raw) {
    const match = piece.match(/^(.+?)([.,;:!?]+)$/);
    if (match) {
      tokens.push({ text: match[1], type: 'word' });
      tokens.push({ text: match[2], type: 'punct' });
    } else if (PUNCT_RE.test(piece)) {
      tokens.push({ text: piece, type: 'punct' });
    } else {
      tokens.push({ text: piece, type: 'word' });
    }
  }
  return tokens;
}

// --- State atoms ---

export const currentLineIndexAtom = atom(0);

export const totalLinesAtom = atom(echoLines.length);

export const currentLineAtom = atom(
  (get) => echoLines[get(currentLineIndexAtom)],
);

export const tokensAtom = atom<Token[]>((get) => {
  const line = get(currentLineAtom);
  return line ? tokenizeSentence(line.content) : [];
});

export const wordTokensAtom = atom<Token[]>((get) =>
  get(tokensAtom).filter((t) => t.type === 'word'),
);

export const wordStatesAtom = atom<WordState[]>([]);

// Persisted word states per sentence index
export const sentenceWordStatesMapAtom = atom<Map<number, WordState[]>>(new Map());

export const focusedWordIndexAtom = atom(0);

export const showTranslationAtom = atom(false);
export const pronunciationEnabledAtom = atom(true);

// Sentence-level result tracking: index → 'completed' | 'attempted'
export const sentenceResultsAtom = atom<Map<number, 'completed' | 'attempted'>>(new Map());

export const sentenceStatusesAtom = atom<SentenceStatus[]>((get) => {
  const total = echoLines.length;
  const current = get(currentLineIndexAtom);
  const results = get(sentenceResultsAtom);
  return Array.from({ length: total }, (_, i) => {
    if (i === current) return 'current';
    return results.get(i) ?? 'not-started';
  });
});

// --- Derived atoms ---

export const isSentenceCompleteAtom = atom((get) => {
  const states = get(wordStatesAtom);
  return states.length > 0 && states.every((s) => s.status !== 'empty');
});

export const correctCountAtom = atom((get) =>
  get(wordStatesAtom).filter((s) => s.status === 'correct').length,
);

export const totalWordsAtom = atom((get) => get(wordTokensAtom).length);

// --- Action atoms ---

export const initializeWordStatesAtom = atom(null, (get, set) => {
  const words = get(wordTokensAtom);
  set(
    wordStatesAtom,
    words.map(() => ({ userInput: '', status: 'empty' as WordStatus })),
  );
  set(focusedWordIndexAtom, 0);
});

export const submitCurrentWordAtom = atom(null, (get, set) => {
  const words = get(wordTokensAtom);
  const states = [...get(wordStatesAtom)];
  const idx = get(focusedWordIndexAtom);

  if (idx >= words.length) return;

  const expected = words[idx].text;
  const userInput = states[idx].userInput;

  states[idx] = {
    userInput,
    status:
      userInput.toLowerCase() === expected.toLowerCase()
        ? 'correct'
        : 'incorrect',
  };

  set(wordStatesAtom, states);

  // Auto-advance to next empty word
  const nextEmpty = states.findIndex(
    (s, i) => i > idx && s.status === 'empty',
  );
  if (nextEmpty !== -1) {
    set(focusedWordIndexAtom, nextEmpty);
  }
});

export const updateCurrentWordInputAtom = atom(
  null,
  (get, set, char: string) => {
    const states = [...get(wordStatesAtom)];
    const idx = get(focusedWordIndexAtom);
    const words = get(wordTokensAtom);

    if (idx >= words.length) return;

    const currentInput = states[idx].userInput;

    // Don't exceed word length — allow 2 extra chars for longer attempts
    if (currentInput.length >= words[idx].text.length + 2) return;

    states[idx] = {
      userInput: currentInput + char,
      status: 'empty', // Reset status when editing
    };

    set(wordStatesAtom, states);
  },
);

export const deleteLastCharAtom = atom(null, (get, set) => {
  const states = [...get(wordStatesAtom)];
  const idx = get(focusedWordIndexAtom);

  if (idx >= states.length) return;

  let targetIdx = idx;

  // Current word empty → move to previous word
  if (states[idx].userInput.length === 0 && idx > 0) {
    targetIdx = idx - 1;
    set(focusedWordIndexAtom, targetIdx);
  }

  const currentInput = states[targetIdx].userInput;
  if (currentInput.length === 0) return;

  states[targetIdx] = {
    userInput: currentInput.slice(0, -1),
    status: 'empty',
  };

  set(wordStatesAtom, states);
});

export const moveFocusAtom = atom(
  null,
  (get, set, direction: 'prev' | 'next') => {
    const words = get(wordTokensAtom);
    const current = get(focusedWordIndexAtom);

    if (direction === 'next' && current < words.length - 1) {
      set(focusedWordIndexAtom, current + 1);
    } else if (direction === 'prev' && current > 0) {
      set(focusedWordIndexAtom, current - 1);
    }
  },
);

export const setFocusedWordAtom = atom(null, (_get, set, index: number) => {
  set(focusedWordIndexAtom, index);
});

// Save current sentence's word states and result before navigating away
const saveSentenceProgressAtom = atom(null, (get, set) => {
  const states = get(wordStatesAtom);
  const idx = get(currentLineIndexAtom);
  if (states.length === 0) return;

  // Save word states
  set(sentenceWordStatesMapAtom, (prev) => {
    const next = new Map(prev);
    next.set(idx, states);
    return next;
  });

  // Save sentence result if all words are filled
  if (states.every((s) => s.status !== 'empty')) {
    const allCorrect = states.every((s) => s.status === 'correct');
    set(sentenceResultsAtom, (prev) => {
      const next = new Map(prev);
      next.set(idx, allCorrect ? 'completed' : 'attempted');
      return next;
    });
  }
});

// Navigate to a sentence index, restoring saved state if available
const goToSentenceAtom = atom(null, (get, set, index: number) => {
  set(currentLineIndexAtom, index);
  const saved = get(sentenceWordStatesMapAtom).get(index);
  if (saved) {
    set(wordStatesAtom, saved);
    // Focus first empty word, or last word if all filled
    const firstEmpty = saved.findIndex((s) => s.status === 'empty');
    set(focusedWordIndexAtom, firstEmpty !== -1 ? firstEmpty : saved.length - 1);
  } else {
    set(initializeWordStatesAtom);
  }
});

export const nextSentenceAtom = atom(null, (get, set) => {
  const current = get(currentLineIndexAtom);
  if (current < echoLines.length - 1) {
    set(saveSentenceProgressAtom);
    set(goToSentenceAtom, current + 1);
  }
});

export const previousSentenceAtom = atom(null, (get, set) => {
  const current = get(currentLineIndexAtom);
  if (current > 0) {
    set(saveSentenceProgressAtom);
    set(goToSentenceAtom, current - 1);
  }
});

export const jumpToSentenceAtom = atom(null, (_get, set, index: number) => {
  if (index < 0 || index >= echoLines.length) return;
  set(saveSentenceProgressAtom);
  set(goToSentenceAtom, index);
});

export const retrySentenceAtom = atom(null, (get, set) => {
  const idx = get(currentLineIndexAtom);
  // Clear saved word states for this sentence
  set(sentenceWordStatesMapAtom, (prev) => {
    const next = new Map(prev);
    next.delete(idx);
    return next;
  });
  // Clear sentence result
  set(sentenceResultsAtom, (prev) => {
    const next = new Map(prev);
    next.delete(idx);
    return next;
  });
  set(initializeWordStatesAtom);
});
