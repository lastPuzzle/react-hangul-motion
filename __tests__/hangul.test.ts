import {
  decomposeHangul,
  composeHangul,
  getTypingSteps,
  getTextTypingSteps,
  isHangul,
} from "../src/utils/hangul";

describe("한글 유틸리티 테스트", () => {
  test("한글 분해가 잘 되는지", () => {
    const 결과 = decomposeHangul("안");
    expect(결과?.initial).toBe("ㅇ");
    expect(결과?.medial).toBe("ㅏ");
    expect(결과?.final).toBe("ㄴ");
  });

  test("한글 조합이 잘 되는지", () => {
    const 결과 = composeHangul("ㅇ", "ㅏ", "ㄴ");
    expect(결과).toBe("안");
  });

  test("타이핑 단계가 올바른지", () => {
    const 단계들 = getTypingSteps("안");
    expect(단계들).toEqual(["ㅇ", "아", "안"]);
  });

  test("문장 타이핑이 누적되는지", () => {
    const 단계들 = getTextTypingSteps("안녕");
    expect(단계들).toContain("ㅇ");
    expect(단계들).toContain("아");
    expect(단계들).toContain("안");
    expect(단계들).toContain("안ㄴ");
    expect(단계들).toContain("안녀");
    expect(단계들).toContain("안녕");
  });

  test("한글 판별이 정확한지", () => {
    expect(isHangul("가")).toBe(true);
    expect(isHangul("A")).toBe(false);
    expect(isHangul("1")).toBe(false);
  });

  test("받침 없는 글자도 잘 처리되는지", () => {
    const 단계들 = getTypingSteps("가");
    expect(단계들).toEqual(["ㄱ", "가"]);
  });

  test("영어와 한글 섞인 텍스트", () => {
    const 단계들 = getTextTypingSteps("Hi안");
    expect(단계들).toContain("H");
    expect(단계들).toContain("Hi");
    expect(단계들).toContain("Hiㅇ");
    expect(단계들).toContain("Hi아");
    expect(단계들).toContain("Hi안");
  });

  test("조합과정 안보이게 설정", () => {
    const 단계들 = getTextTypingSteps("안녕", false);
    expect(단계들).toEqual(["안", "안녕"]);
  });

  test("줄바꿈 문자가 포함된 텍스트 처리", () => {
    const 단계들 = getTextTypingSteps("안녕\n하세요");
    expect(단계들).toContain("ㅇ");
    expect(단계들).toContain("아");
    expect(단계들).toContain("안");
    expect(단계들).toContain("안ㄴ");
    expect(단계들).toContain("안녀");
    expect(단계들).toContain("안녕");
    expect(단계들).toContain("안녕\n");
    expect(단계들).toContain("안녕\nㅎ");
    expect(단계들).toContain("안녕\n하");
    expect(단계들).toContain("안녕\n하세요");
  });

  test("줄바꿈만 있는 텍스트", () => {
    const 단계들 = getTextTypingSteps("\n");
    expect(단계들).toEqual(["\n"]);
  });

  test("여러 줄바꿈이 연속으로 있는 경우", () => {
    const 단계들 = getTextTypingSteps("안\n\n녕");
    expect(단계들).toContain("ㅇ");
    expect(단계들).toContain("아");
    expect(단계들).toContain("안");
    expect(단계들).toContain("안\n");
    expect(단계들).toContain("안\n\n");
    expect(단계들).toContain("안\n\nㄴ");
    expect(단계들).toContain("안\n\n녀");
    expect(단계들).toContain("안\n\n녕");
  });

  test("\\n 문자열을 실제 줄바꿈으로 변환", () => {
    // 실제 사용 시나리오: 사용자가 "안녕\\n하세요" 문자열을 입력
    const input = "안녕\\n하세요";
    const converted = input.replace(/\\n/g, "\n");
    const 단계들 = getTextTypingSteps(converted);

    expect(단계들).toContain("ㅇ");
    expect(단계들).toContain("아");
    expect(단계들).toContain("안");
    expect(단계들).toContain("안ㄴ");
    expect(단계들).toContain("안녀");
    expect(단계들).toContain("안녕");
    expect(단계들).toContain("안녕\n");
    expect(단계들).toContain("안녕\nㅎ");
    expect(단계들).toContain("안녕\n하");
    expect(단계들).toContain("안녕\n하세요");
  });
});
