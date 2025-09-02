# 🇰🇷 React Hangul Motion

React 기반 한글 타이핑 애니메이션 라이브러리

## ✨ 특징

- 🎯 **한글 조합 과정** - ㅇ → 아 → 안 자연스러운 타이핑 효과
- ⚡ **TypeScript 지원** - 완전한 타입 안전성
- 🎨 **커스터마이징** - 속도, 커서, 스타일 등 자유롭게 설정
- 📦 **가벼움** - 의존성 최소화
- 🔧 **사용하기 쉬움** - 간단한 API

## 📦 설치

```bash
npm install react-hangul-motion
```

## 🚀 빠른 시작

```tsx
import { HangulMotion } from "react-hangul-motion";

function App() {
  return (
    <div>
      <HangulMotion text="안녕하세요!" />
    </div>
  );
}
```

## 📖 사용법

### 기본 사용

```tsx
<HangulMotion text="한글 타이핑 애니메이션" speed={100} cursor={true} />
```

### 커스텀 옵션

```tsx
<HangulMotion
  text="커스텀 설정"
  speed={150} // 타이핑 속도 (ms)
  delay={1000} // 시작 지연 (ms)
  cursor={true} // 커서 표시
  cursorChar="▋" // 커서 문자
  cursorBlink={true} // 커서 깜빡임
  showComposition={true} // 조합 과정 표시
  autoStart={true} // 자동 시작
/>
```

### 훅 사용

```tsx
import { useHangulMotion } from "react-hangul-motion";

function CustomComponent() {
  const motion = useHangulMotion("안녕하세요", {
    speed: 100,
    onComplete: () => console.log("완료!"),
  });

  return (
    <div>
      <span>{motion.displayText}</span>
      <button onClick={motion.start}>시작</button>
      <button onClick={motion.stop}>중지</button>
      <button onClick={motion.reset}>리셋</button>
    </div>
  );
}
```

## 📝 API

### HangulMotion Props

| 속성              | 타입      | 기본값 | 설명                |
| ----------------- | --------- | ------ | ------------------- |
| `text`            | `string`  | -      | 타이핑할 텍스트     |
| `speed`           | `number`  | `100`  | 타이핑 속도 (ms)    |
| `delay`           | `number`  | `0`    | 시작 지연 시간 (ms) |
| `cursor`          | `boolean` | `true` | 커서 표시 여부      |
| `cursorChar`      | `string`  | `\|`   | 커서 문자           |
| `cursorBlink`     | `boolean` | `true` | 커서 깜빡임         |
| `showComposition` | `boolean` | `true` | 조합 과정 표시      |
| `autoStart`       | `boolean` | `true` | 자동 시작           |

### useHangulMotion 훅

```tsx
const motion = useHangulMotion(text, options);

// 메서드
motion.start(); // 타이핑 시작
motion.stop(); // 타이핑 중지
motion.reset(); // 리셋
motion.restart(); // 재시작

// 상태
motion.displayText; // 현재 표시되는 텍스트
motion.isTyping; // 타이핑 중인지 여부
motion.isComplete; // 완료 여부
```

## 🎨 예제

### 다양한 스타일

```tsx
// 빠른 타이핑
<HangulMotion text="빠른 타이핑" speed={50} />

// 느린 타이핑
<HangulMotion text="느린 타이핑" speed={300} />

// 조합 과정 없이
<HangulMotion text="바로 출력" showComposition={false} />

// 커스텀 커서
<HangulMotion text="특별한 커서" cursorChar="●" />
```

## 📄 라이센스

MIT

## 🤝 기여

이슈나 PR은 언제나 환영합니다!
