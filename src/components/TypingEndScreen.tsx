"use client";

import { useEffect, useRef } from "react";
import { useCompletion } from "@ai-sdk/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatTime } from "@/lib/utils";
import { StatItem } from "@/components/StatItem";
import type { WpmSnapshot } from "@/types/typing";

interface TypingEndScreenProps {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  correctCount: number;
  totalTyped: number;
  wpmHistory: WpmSnapshot[];
  incorrectKeys: Record<string, number>;
  onReset: () => void;
  onNextPassage: () => void;
}

export function TypingEndScreen({
  wpm,
  accuracy,
  elapsedSeconds,
  correctCount,
  totalTyped,
  wpmHistory,
  incorrectKeys,
  onReset,
  onNextPassage,
}: TypingEndScreenProps) {
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/suggestions",
    body: { incorrectKeys },
  });

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    complete("");
  }, [complete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-foreground/10 bg-background p-10 text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-foreground">Test Complete</h2>

        <div className="mt-8 grid grid-cols-4 gap-6">
          <StatItem value={String(wpm)} label="WPM" />
          <StatItem value={`${accuracy}%`} label="Accuracy" />
          <StatItem value={formatTime(elapsedSeconds)} label="Time" />
          <StatItem value={`${correctCount}/${totalTyped}`} label="Correct" />
        </div>

        {wpmHistory.length > 1 && (
          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-foreground/40">
              WPM over time
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={wpmHistory} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="second"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--foreground)", opacity: 0.35 }}
                  tickFormatter={(v) => `${v}s`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--foreground)", opacity: 0.35 }}
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                  formatter={(value) => [`${value} WPM`, ""]}
                  labelFormatter={(label) => `${label}s`}
                  cursor={{ stroke: "var(--foreground)", strokeOpacity: 0.15 }}
                />
                <Area
                  type="basis"
                  dataKey="wpm"
                  stroke="var(--foreground)"
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                  fill="url(#wpmGradient)"
                  dot={false}
                  activeDot={{ r: 3, fill: "var(--foreground)", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-foreground/10 bg-foreground/3 px-6 py-4 text-left">
          <p className="mb-2 text-xs uppercase tracking-widest text-foreground/40">
            AI Coach
          </p>
          {isLoading && !completion ? (
            <p className="text-sm text-foreground/40 animate-pulse">Analyzing your session…</p>
          ) : (
            <ul className="space-y-2">
              {completion.split("\n").filter(line => line.trim()).map((line, i) => (
                <li key={i} className="text-sm leading-relaxed text-foreground/70">{line}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            className="cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium transition-colors border border-foreground/15 text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
            onClick={onReset}
          >
            Try Again
          </button>
          <button
            className="cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium transition-colors bg-foreground text-background hover:bg-foreground/85"
            onClick={onNextPassage}
          >
            Next Passage
          </button>
        </div>
      </div>
    </div>
  );
}
