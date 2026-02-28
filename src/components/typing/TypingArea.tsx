import { cn } from "@/lib/utils";
import type { CharStatus } from "@/types/typing";

interface TypingAreaProps {
  currentText: string;
  typedChars: CharStatus[];
  currentIndex: number;
  isFinished: boolean;
}

export function TypingArea({
  currentText,
  typedChars,
  currentIndex,
  isFinished,
}: TypingAreaProps) {
  return (
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
              status === "incorrect" && "text-red-400 bg-red-400/15 rounded-sm"
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
  );
}
