import { useState, useEffect, useCallback, useRef } from "react";
import { HangulMotionOptions, HangulMotionState } from "../types";
import { getTextTypingSteps } from "../utils/hangul";

const defaultOptions: Required<HangulMotionOptions> = {
  speed: 100,
  delay: 0,
  loop: false,
  loopDelay: 1000,
  cursor: true,
  cursorBlink: true,
  cursorChar: "|",
  showComposition: true,
  skipAnimation: false,
  onStart: () => {},
  onComplete: () => {},
  onType: () => {},
};

export function useHangulMotion(
  text: string,
  options: HangulMotionOptions = {}
) {
  const opts = { ...defaultOptions, ...options };
  const [state, setState] = useState<HangulMotionState>({
    displayText: "",
    isTyping: false,
    isComplete: false,
    currentIndex: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef<string[]>([]);
  const isManuallyStoppedRef = useRef(false);

  const generateSteps = useCallback(() => {
    const processedText = text.replace(/\\n/g, "\n");

    if (opts.skipAnimation) {
      return [processedText];
    }

    return getTextTypingSteps(processedText, opts.showComposition);
  }, [text, opts.showComposition, opts.skipAnimation]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isManuallyStoppedRef.current = true;
    setState((prev) => ({ ...prev, isTyping: false }));
  }, []);

  const reset = useCallback(() => {
    stop();
    setState({
      displayText: "",
      isTyping: false,
      isComplete: false,
      currentIndex: 0,
    });
    isManuallyStoppedRef.current = false;
  }, [stop]);

  const typeStep = useCallback(
    (steps: string[], index: number) => {
      if (index >= steps.length) {
        setState((prev) => ({
          ...prev,
          isTyping: false,
          isComplete: true,
        }));
        opts.onComplete();

        if (opts.loop && !isManuallyStoppedRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (opts.loop && !isManuallyStoppedRef.current) {
              reset();
              start();
            }
          }, opts.loopDelay);
        }
        return;
      }

      const currentStep = steps[index];
      setState((prev) => ({
        ...prev,
        displayText: currentStep,
        currentIndex: index,
      }));

      opts.onType(currentStep, index);

      const nextDelay = index === 0 ? opts.delay : opts.speed;
      timeoutRef.current = setTimeout(() => {
        if (!isManuallyStoppedRef.current) {
          typeStep(steps, index + 1);
        }
      }, nextDelay);
    },
    [opts, reset]
  );

  const start = useCallback(() => {
    if (state.isTyping || state.isComplete) return;

    isManuallyStoppedRef.current = false;
    const steps = generateSteps();
    stepsRef.current = steps;

    if (opts.skipAnimation) {
      setState((prev) => ({
        ...prev,
        displayText: steps[0] || "",
        isTyping: false,
        isComplete: true,
        currentIndex: 0,
      }));
      opts.onStart();
      opts.onComplete();
      return;
    }

    setState((prev) => ({
      ...prev,
      isTyping: true,
      isComplete: false,
    }));

    opts.onStart();
    typeStep(steps, 0);
  }, [generateSteps, opts, typeStep, state.isTyping, state.isComplete]);

  const restart = useCallback(() => {
    reset();
    setTimeout(() => {
      // restart는 완료 상태를 무시하고 강제로 다시 시작
      isManuallyStoppedRef.current = false;
      const steps = generateSteps();
      stepsRef.current = steps;

      setState((prev) => ({
        ...prev,
        isTyping: true,
        isComplete: false,
      }));

      opts.onStart();
      typeStep(steps, 0);
    }, 50);
  }, [reset, generateSteps, opts, typeStep]);

  const getState = useCallback(() => state, [state]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    reset();
  }, [text, reset]);

  return {
    ...state,
    start,
    stop,
    restart,
    reset,
    getState,
  };
}
