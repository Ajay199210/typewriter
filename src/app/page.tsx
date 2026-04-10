"use client";

import { useTypingTest } from "@/hooks/useTypingTest";
import { TypingArea } from "@/components/TypingArea";
import { TypingStats } from "@/components/TypingStats";
import { TypingEndScreen } from "@/components/TypingEndScreen";

export default function Home() {
  const {
    currentText,
    typedChars,
    currentIndex,
    wpm,
    accuracy,
    progress,
    elapsedSeconds,
    isStarted,
    isFinished,
    correctCount,
    totalTyped,
    wpmHistory,
    reset,
    nextPassage,
  } = useTypingTest();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 font-sans">
      <main className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Typewriter
          </h1>
          <p className="mt-2 text-sm text-foreground/50">
            {!isStarted
              ? "Start typing to begin the test"
              : isFinished
                ? "Test complete!"
                : "Keep going..."}
          </p>
        </div>

        <TypingStats
          wpm={wpm}
          accuracy={accuracy}
          elapsedSeconds={elapsedSeconds}
          progress={progress}
        />

        <TypingArea
          currentText={currentText}
          typedChars={typedChars}
          currentIndex={currentIndex}
          isFinished={isFinished}
        />

        <div className="flex justify-center gap-4">
          <button className="cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium transition-colors border border-foreground/15 text-foreground/70 hover:bg-foreground/5 hover:text-foreground" onClick={reset}>
            Reset
          </button>
          <button className="cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium transition-colors bg-foreground text-background hover:bg-foreground/85" onClick={nextPassage}>Next Passage</button>
        </div>
      </main>

      {isFinished && (
        <TypingEndScreen
          wpm={wpm}
          accuracy={accuracy}
          elapsedSeconds={elapsedSeconds}
          correctCount={correctCount}
          totalTyped={totalTyped}
          wpmHistory={wpmHistory}
          onReset={reset}
          onNextPassage={nextPassage}
        />
      )}
    </div>
  );
}
