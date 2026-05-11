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

export const focusedWordIndexAtom = atom(0);

export const showTranslationAtom = atom(false);
export const pronunciationEnabledAtom = atom(true);

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

export const nextSentenceAtom = atom(null, (get, set) => {
  const current = get(currentLineIndexAtom);
  if (current < echoLines.length - 1) {
    set(currentLineIndexAtom, current + 1);
    set(initializeWordStatesAtom);
  }
});

export const previousSentenceAtom = atom(null, (get, set) => {
  const current = get(currentLineIndexAtom);
  if (current > 0) {
    set(currentLineIndexAtom, current - 1);
    set(initializeWordStatesAtom);
  }
});

export const retrySentenceAtom = atom(null, (_get, set) => {
  set(initializeWordStatesAtom);
});
