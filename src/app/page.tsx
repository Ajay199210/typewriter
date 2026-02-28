"use client";

import { useTypingTest } from "@/hooks/useTypingTest";
import { Button } from "@/components/ui/Button";
import { TypingArea } from "@/components/typing/TypingArea";
import { TypingStats } from "@/components/typing/TypingStats";
import { TypingEndScreen } from "@/components/typing/TypingEndScreen";

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

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
          <Button onClick={nextPassage}>Next Passage</Button>
        </div>
      </main>

      {isFinished && (
        <TypingEndScreen
          wpm={wpm}
          accuracy={accuracy}
          elapsedSeconds={elapsedSeconds}
          correctCount={correctCount}
          totalTyped={totalTyped}
          onReset={reset}
          onNextPassage={nextPassage}
        />
      )}
    </div>
  );
}
