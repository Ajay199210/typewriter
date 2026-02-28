import { Button } from "@/components/ui/Button";
import { formatTime } from "@/lib/utils";

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <div className="text-4xl font-bold font-mono text-foreground tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-foreground/40">
        {label}
      </div>
    </div>
  );
}

interface TypingEndScreenProps {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  correctCount: number;
  totalTyped: number;
  onReset: () => void;
  onNextPassage: () => void;
}

export function TypingEndScreen({
  wpm,
  accuracy,
  elapsedSeconds,
  correctCount,
  totalTyped,
  onReset,
  onNextPassage,
}: TypingEndScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-10 text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-foreground">Test Complete</h2>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <StatItem value={String(wpm)} label="WPM" />
          <StatItem value={`${accuracy}%`} label="Accuracy" />
          <StatItem value={formatTime(elapsedSeconds)} label="Time" />
          <StatItem value={`${correctCount}/${totalTyped}`} label="Correct" />
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="ghost" onClick={onReset}>
            Try Again
          </Button>
          <Button onClick={onNextPassage}>Next Passage</Button>
        </div>
      </div>
    </div>
  );
}
