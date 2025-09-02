import { HangulChar } from "../types";

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const INITIAL_COUNT = 19;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;

const INITIALS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const MEDIALS = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];

const FINALS = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

export function decomposeHangul(char: string): HangulChar | null {
  const code = char.charCodeAt(0);

  if (code < HANGUL_START || code > HANGUL_END) {
    return null;
  }

  const hangulCode = code - HANGUL_START;
  const initialIndex = Math.floor(hangulCode / (MEDIAL_COUNT * FINAL_COUNT));
  const medialIndex = Math.floor(
    (hangulCode % (MEDIAL_COUNT * FINAL_COUNT)) / FINAL_COUNT
  );
  const finalIndex = hangulCode % FINAL_COUNT;

  return {
    initial: INITIALS[initialIndex],
    medial: MEDIALS[medialIndex],
    final: finalIndex > 0 ? FINALS[finalIndex] : undefined,
    combined: char,
  };
}

export function composeHangul(
  initial: string,
  medial: string,
  final?: string
): string {
  const initialIndex = INITIALS.indexOf(initial);
  const medialIndex = MEDIALS.indexOf(medial);
  const finalIndex = final ? FINALS.indexOf(final) : 0;

  if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) {
    return "";
  }

  const code =
    HANGUL_START +
    initialIndex * MEDIAL_COUNT * FINAL_COUNT +
    medialIndex * FINAL_COUNT +
    finalIndex;
  return String.fromCharCode(code);
}

export function getTypingSteps(char: string): string[] {
  const decomposed = decomposeHangul(char);

  if (!decomposed) {
    return [char];
  }

  const steps: string[] = [];
  const { initial, medial, final } = decomposed;

  if (initial && medial) {
    steps.push(initial);
    steps.push(composeHangul(initial, medial));

    if (final) {
      steps.push(composeHangul(initial, medial, final));
    }
  }

  return steps;
}

export function getTextTypingSteps(
  text: string,
  showComposition = true
): string[] {
  if (!showComposition) {
    const steps: string[] = [];
    for (let i = 1; i <= text.length; i++) {
      steps.push(text.slice(0, i));
    }
    return steps;
  }

  const allSteps: string[] = [];
  let completedText = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charSteps = getTypingSteps(char);

    for (const step of charSteps) {
      allSteps.push(completedText + step);
    }

    completedText += char;
  }

  return allSteps;
}

export function isHangul(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
}

export function isConsonant(char: string): boolean {
  return INITIALS.includes(char) || FINALS.includes(char);
}

export function isVowel(char: string): boolean {
  return MEDIALS.includes(char);
}
