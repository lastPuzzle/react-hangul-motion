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
    const motion = useHangulMotion(text, {
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
      if (autoStart && text && !hasStartedRef.current) {
        hasStartedRef.current = true;
        motion.start();
      }
    }, [autoStart, text]);

    useEffect(() => {
      if (text) {
        hasStartedRef.current = false;
      }
    }, [text]);

    const displayContent = React.useMemo(() => {
      return (
        <>
          {motion.displayText}
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
