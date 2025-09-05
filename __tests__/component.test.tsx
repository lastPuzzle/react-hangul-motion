import React from "react";
import { render, screen } from "@testing-library/react";
import { HangulMotion } from "../src/components/HangulMotion";

jest.useFakeTimers();

describe("한글모션 컴포넌트 테스트", () => {
  test("기본 렌더링 확인", () => {
    render(<HangulMotion text="안녕" autoStart={false} />);
    expect(screen.getByText("|")).toBeInTheDocument();
  });

  test("커서 안보이게 설정", () => {
    render(<HangulMotion text="안녕" cursor={false} autoStart={false} />);
    const 요소 = document.querySelector("span");
    expect(요소).toBeInTheDocument();
    expect(요소?.textContent).toBe("");
  });

  test("커스텀 커서 문자", () => {
    render(<HangulMotion text="안녕" cursorChar="_" autoStart={false} />);
    expect(screen.getByText("_")).toBeInTheDocument();
  });

  test("CSS 클래스 적용", () => {
    const { container } = render(
      <HangulMotion text="안녕" className="테스트클래스" autoStart={false} />
    );
    const 요소 = container.querySelector(".테스트클래스");
    expect(요소).toBeInTheDocument();
  });

  test("다른 HTML 태그 사용", () => {
    const { container } = render(
      <HangulMotion text="안녕" as="div" autoStart={false} />
    );
    const 요소 = container.querySelector("div");
    expect(요소?.tagName).toBe("DIV");
  });

  test("줄바꿈 문자 처리", () => {
    const { container } = render(
      <HangulMotion text="첫번째 줄\n두번째 줄" autoStart={false} />
    );
    const br요소 = container.querySelector("br");
    expect(br요소).toBeInTheDocument();
  });

  test("여러 줄바꿈 처리", () => {
    const { container } = render(
      <HangulMotion text="첫째\n둘째\n셋째" autoStart={false} />
    );
    const br요소들 = container.querySelectorAll("br");
    expect(br요소들).toHaveLength(2);
  });

  test("skipAnimation 옵션으로 애니메이션 없이 바로 표시", () => {
    const { container } = render(
      <HangulMotion text="안녕하세요" skipAnimation={true} autoStart={true} />
    );
    const 요소 = container.querySelector("span");
    expect(요소?.textContent).toBe("안녕하세요|");
  });
});
