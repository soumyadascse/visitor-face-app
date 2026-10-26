export const maskMobile = (mobile: string) => {
  if (!mobile || mobile.length < 10) {
    return mobile;
  }

  return `${mobile.slice(0, 2)}******${mobile.slice(-2)}`;
};

export const speak = (text: string) => {

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.rate = 1;

  utterance.pitch = 1;

  utterance.volume = 1;

  window.speechSynthesis.speak(
    utterance
  );

};