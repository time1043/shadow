import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((word: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en';
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}
