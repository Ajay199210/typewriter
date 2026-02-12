"use client";

import { useTypingTest } from "./hooks/useTypingTest";

function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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

        {/* Stats Bar */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
              {wpm}
            </div>
            <div className="text-xs uppercase tracking-widest text-foreground/40">
              WPM
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs uppercase tracking-widest text-foreground/40">
              Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-xs uppercase tracking-widest text-foreground/40">
              Time
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-foreground/60 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Typing Area */}
        <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-8 font-mono text-lg leading-relaxed tracking-wide select-none">
          {currentText.split("").map((char, index) => {
            const status = typedChars[index];
            const isCursor = index === currentIndex;

            return (
              <span
                key={index}
                className={cn(
                  "relative transition-colors duration-150",
                  status === "untyped" && "text-foreground/25",
                  status === "correct" && "text-foreground animate-fade-type",
                  status === "incorrect" &&
                    "text-red-400 bg-red-400/15 rounded-sm"
                )}
              >
                {isCursor && !isFinished && (
                  <span className="absolute left-0 top-0 h-full w-[2px] -translate-x-[1px] bg-foreground animate-blink" />
                )}
                {char}
              </span>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg border border-foreground/15 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={nextPassage}
            className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 cursor-pointer"
          >
            Next Passage
          </button>
        </div>
      </main>

      {/* End Screen Overlay */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-10 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-foreground">
              Test Complete
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold font-mono text-foreground tabular-nums">
                  {wpm}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/40">
                  WPM
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold font-mono text-foreground tabular-nums">
                  {accuracy}%
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/40">
                  Accuracy
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold font-mono text-foreground tabular-nums">
                  {formatTime(elapsedSeconds)}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/40">
                  Time
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold font-mono text-foreground tabular-nums">
                  {correctCount}/{totalTyped}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/40">
                  Correct
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={reset}
                className="rounded-lg border border-foreground/15 px-6 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={nextPassage}
                className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 cursor-pointer"
              >
                Next Passage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
