"use client";

import { useReducer, useEffect, useState, useCallback } from "react";

type CharStatus = "untyped" | "correct" | "incorrect";

const PASSAGES: string[] = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once, making it a favorite for typing practice.",
  "In the middle of difficulty lies opportunity. The only way to do great work is to love what you do. Stay hungry, stay foolish, and never stop learning.",
  "Code is like humor. When you have to explain it, it is bad. Programming is not about typing, it is about thinking. First, solve the problem, then write the code.",
  "The best error message is the one that never shows up. Talk is cheap, show me the code. Simplicity is the soul of efficiency in everything we build.",
  "Technology is best when it brings people together. The advance of technology is based on making it fit in so that you do not even notice it is there around you.",
];

interface State {
  currentText: string;
  typedChars: CharStatus[];
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  elapsedSeconds: number;
  isStarted: boolean;
  isFinished: boolean;
}

type Action =
  | { type: "KEY_PRESS"; key: string }
  | { type: "BACKSPACE" }
  | { type: "TICK" }
  | { type: "RESET"; passage: string }
  | { type: "NEXT_PASSAGE"; passage: string };

function createInitialState(passage: string): State {
  return {
    currentText: passage,
    typedChars: new Array(passage.length).fill("untyped"),
    currentIndex: 0,
    startTime: null,
    endTime: null,
    elapsedSeconds: 0,
    isStarted: false,
    isFinished: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "KEY_PRESS": {
      if (state.isFinished) return state;
      const now = Date.now();
      const newStartTime = state.startTime ?? now;
      const isCorrect = action.key === state.currentText[state.currentIndex];
      const newTypedChars = [...state.typedChars];
      newTypedChars[state.currentIndex] = isCorrect ? "correct" : "incorrect";
      const newIndex = state.currentIndex + 1;
      const finished = newIndex === state.currentText.length;
      return {
        ...state,
        typedChars: newTypedChars,
        currentIndex: newIndex,
        startTime: newStartTime,
        isStarted: true,
        isFinished: finished,
        endTime: finished ? now : null,
      };
    }
    case "BACKSPACE": {
      if (state.isFinished || state.currentIndex === 0) return state;
      const newTypedChars = [...state.typedChars];
      const newIndex = state.currentIndex - 1;
      newTypedChars[newIndex] = "untyped";
      return {
        ...state,
        typedChars: newTypedChars,
        currentIndex: newIndex,
      };
    }
    case "TICK": {
      if (!state.startTime || state.isFinished) return state;
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      return { ...state, elapsedSeconds: elapsed };
    }
    case "RESET":
    case "NEXT_PASSAGE":
      return createInitialState(action.passage);
    default:
      return state;
  }
}

export function useTypingTest() {
  const [passageIndex, setPassageIndex] = useState(0);
  const [state, dispatch] = useReducer(
    reducer,
    PASSAGES[0],
    createInitialState
  );

  // Derived values
  const correctCount = state.typedChars.filter((s) => s === "correct").length;
  const incorrectCount = state.typedChars.filter(
    (s) => s === "incorrect"
  ).length;
  const totalTyped = correctCount + incorrectCount;
  const accuracy =
    totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
  const wpm =
    state.elapsedSeconds > 0
      ? Math.round(correctCount / 5 / (state.elapsedSeconds / 60))
      : 0;
  const progress = Math.round(
    (state.currentIndex / state.currentText.length) * 100
  );

  // Timer
  useEffect(() => {
    if (!state.isStarted || state.isFinished) return;
    const interval = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(interval);
  }, [state.isStarted, state.isFinished]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") e.preventDefault();
      if (e.key === "Backspace") e.preventDefault();

      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "CapsLock" ||
        e.key === "Enter"
      ) {
        return;
      }

      if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
        return;
      }

      if (e.key.length === 1) {
        dispatch({ type: "KEY_PRESS", key: e.key });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET", passage: PASSAGES[passageIndex] });
  }, [passageIndex]);

  const nextPassage = useCallback(() => {
    const newIndex = (passageIndex + 1) % PASSAGES.length;
    setPassageIndex(newIndex);
    dispatch({ type: "NEXT_PASSAGE", passage: PASSAGES[newIndex] });
  }, [passageIndex]);

  return {
    currentText: state.currentText,
    typedChars: state.typedChars,
    currentIndex: state.currentIndex,
    wpm,
    accuracy,
    progress,
    elapsedSeconds: state.elapsedSeconds,
    isStarted: state.isStarted,
    isFinished: state.isFinished,
    correctCount,
    incorrectCount,
    totalTyped,
    reset,
    nextPassage,
  };
}
