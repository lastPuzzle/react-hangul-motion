import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { HangulMotionOptions, HangulMotionRef } from "../types";
import { useHangulMotion } from "../hooks/useHangulMotion";

interface HangulMotionProps extends HangulMotionOptions {
  text: string;
  autoStart?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export const HangulMotion = forwardRef<HangulMotionRef, HangulMotionProps>(
  (
    {
      text,
      autoStart = true,
      className,
      style,
      as: Component = "span",
      cursor = true,
      cursorBlink = true,
      cursorChar = "|",
      ...options
    },
    ref
  ) => {
    // \\n 문자열을 실제 줄바꿈 문자로 변환
    const processedText = text.replace(/\\n/g, "\n");

    const motion = useHangulMotion(processedText, {
      cursor,
      cursorBlink,
      cursorChar,
      ...options,
    });

    useImperativeHandle(
      ref,
      () => ({
        start: motion.start,
        stop: motion.stop,
        restart: motion.restart,
        reset: motion.reset,
        getState: motion.getState,
      }),
      [motion]
    );

    const hasStartedRef = useRef(false);

    useEffect(() => {
      if (
        autoStart &&
        processedText &&
        !hasStartedRef.current &&
        !motion.isComplete
      ) {
        hasStartedRef.current = true;
        motion.start();
      }
    }, [autoStart, processedText, motion]);

    useEffect(() => {
      if (processedText) {
        hasStartedRef.current = false;
      }
    }, [processedText]);

    const displayContent = React.useMemo(() => {
      const textWithLineBreaks = motion.displayText
        .split("\n")
        .map((line, index, array) => (
          <React.Fragment key={index}>
            {line}
            {index < array.length - 1 && <br />}
          </React.Fragment>
        ));

      return (
        <>
          {textWithLineBreaks}
          {cursor && (
            <span
              style={{
                animation: cursorBlink
                  ? "hangul-motion-blink 1s infinite"
                  : "none",
              }}
            >
              {cursorChar}
            </span>
          )}
        </>
      );
    }, [motion.displayText, cursor, cursorChar, cursorBlink]);

    return (
      <>
        {cursor && cursorBlink && (
          <style>
            {`
              @keyframes hangul-motion-blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
              }
            `}
          </style>
        )}

        <Component
          className={className}
          style={style}
          data-hangul-motion-typing={motion.isTyping}
          data-hangul-motion-complete={motion.isComplete}
        >
          {displayContent}
        </Component>
      </>
    );
  }
);

HangulMotion.displayName = "HangulMotion";
