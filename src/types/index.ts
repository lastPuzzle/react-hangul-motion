export interface HangulMotionOptions {
  speed?: number;
  delay?: number;
  loop?: boolean;
  loopDelay?: number;
  cursor?: boolean;
  cursorBlink?: boolean;
  cursorChar?: string;
  showComposition?: boolean;
  skipAnimation?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onType?: (char: string, index: number) => void;
}

export interface HangulMotionState {
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
  currentIndex: number;
}

export interface HangulChar {
  initial?: string;
  medial?: string;
  final?: string;
  combined?: string;
}

export type HangulMotionRef = {
  start: () => void;
  stop: () => void;
  restart: () => void;
  reset: () => void;
  getState: () => HangulMotionState;
};
