import { formatTime } from "@/lib/utils";
import { StatItem } from "@/components/StatItem";

interface TypingStatsProps {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  progress: number;
}

export function TypingStats({
  wpm,
  accuracy,
  elapsedSeconds,
  progress,
}: TypingStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-8 text-center">
        <StatItem size="sm" value={String(wpm)} label="WPM" />
        <StatItem size="sm" value={`${accuracy}%`} label="Accuracy" />
        <StatItem size="sm" value={formatTime(elapsedSeconds)} label="Time" />
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-foreground/60 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
