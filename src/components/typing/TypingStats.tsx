import { formatTime } from "@/lib/utils";

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-foreground/40">
        {label}
      </div>
    </div>
  );
}

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
      <div className="flex justify-center gap-8">
        <StatItem value={String(wpm)} label="WPM" />
        <StatItem value={`${accuracy}%`} label="Accuracy" />
        <StatItem value={formatTime(elapsedSeconds)} label="Time" />
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
