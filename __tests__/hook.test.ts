import { renderHook, act } from "@testing-library/react";
import { useHangulMotion } from "../src/hooks/useHangulMotion";

jest.useFakeTimers();

describe("한글모션 훅 테스트", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test("초기 상태 확인", () => {
    const { result } = renderHook(() => useHangulMotion("안녕"));
    expect(result.current.displayText).toBe("");
    expect(result.current.isTyping).toBe(false);
    expect(result.current.isComplete).toBe(false);
  });

  test("타이핑 시작", () => {
    const { result } = renderHook(() => useHangulMotion("안"));

    act(() => {
      result.current.start();
    });

    expect(result.current.isTyping).toBe(true);
  });

  test("타이핑 중지", () => {
    const { result } = renderHook(() => useHangulMotion("안"));

    act(() => {
      result.current.start();
      result.current.stop();
    });

    expect(result.current.isTyping).toBe(false);
  });

  test("타이핑 리셋", () => {
    const { result } = renderHook(() => useHangulMotion("안"));

    act(() => {
      result.current.start();
      result.current.reset();
    });

    expect(result.current.displayText).toBe("");
    expect(result.current.isTyping).toBe(false);
    expect(result.current.isComplete).toBe(false);
  });

  test("속도 설정 확인", () => {
    const { result } = renderHook(() => useHangulMotion("가", { speed: 200 }));

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(0);
    });

    expect(result.current.displayText).toBe("가");
  });

  test("조합과정 안보이게", () => {
    const { result } = renderHook(() =>
      useHangulMotion("안", { showComposition: false })
    );

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(0);
    });

    expect(result.current.displayText).toBe("안");
  });

  test("loop false로 설정하면 반복 안함", () => {
    const { result } = renderHook(() =>
      useHangulMotion("가", { speed: 50, loop: false })
    );

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(100); // 타이핑 완료
    });

    expect(result.current.isComplete).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000); // 충분한 시간 대기
    });

    // 여전히 완료 상태여야 함 (재시작되면 안됨)
    expect(result.current.isComplete).toBe(true);
    expect(result.current.isTyping).toBe(false);
  });
});
