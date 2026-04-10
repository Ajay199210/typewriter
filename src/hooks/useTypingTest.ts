"use client";

import { useReducer, useEffect, useState, useCallback } from "react";
import type { CharStatus, WpmSnapshot } from "@/types/typing";
import { PASSAGES } from "@/lib/passages";

interface State {
  currentText: string;
  typedChars: CharStatus[];
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  elapsedSeconds: number;
  isStarted: boolean;
  isFinished: boolean;
  wpmHistory: WpmSnapshot[];
  incorrectKeys: Record<string, number>;
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
    wpmHistory: [],
    incorrectKeys: {},
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
      const newIncorrectKeys = isCorrect
        ? state.incorrectKeys
        : {
          ...state.incorrectKeys,
          [action.key]: (state.incorrectKeys[action.key] ?? 0) + 1,
        };
      return {
        ...state,
        typedChars: newTypedChars,
        currentIndex: newIndex,
        startTime: newStartTime,
        isStarted: true,
        isFinished: finished,
        endTime: finished ? now : null,
        incorrectKeys: newIncorrectKeys,
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
      const correctCount = state.typedChars.filter((s) => s === "correct").length;
      const wpm = elapsed > 0 ? Math.round(correctCount / 5 / (elapsed / 60)) : 0;
      return {
        ...state,
        elapsedSeconds: elapsed,
        wpmHistory: [...state.wpmHistory, { second: elapsed, wpm }],
      };
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

  const { correctCount, incorrectCount } = state.typedChars.reduce(
    (acc, s) => {
      if (s === "correct") acc.correctCount++;
      else if (s === "incorrect") acc.incorrectCount++;
      return acc;
    },
    { correctCount: 0, incorrectCount: 0 }
  );
  const totalTyped = correctCount + incorrectCount;
  const accuracy =
    totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
  const finalElapsed =
    state.isFinished && state.endTime && state.startTime
      ? (state.endTime - state.startTime) / 1000
      : state.elapsedSeconds;
  const wpm =
    finalElapsed > 0 ? Math.round(correctCount / 5 / (finalElapsed / 60)) : 0;
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
    wpmHistory: state.wpmHistory,
    incorrectKeys: state.incorrectKeys,
    reset,
    nextPassage,
  };
}
