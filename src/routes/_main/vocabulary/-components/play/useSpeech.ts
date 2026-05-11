export function useSpeech() {
  function speak(word: string) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en';
    window.speechSynthesis.speak(utterance);
  }

  return { speak };
}
