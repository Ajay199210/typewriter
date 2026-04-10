import { cn } from "@/lib/utils";

interface StatItemProps {
  value: string;
  label: string;
  size?: "sm" | "lg";
}

export function StatItem({ value, label, size = "lg" }: StatItemProps) {
  return (
    <div>
      <div
        className={cn(
          "font-bold font-mono text-foreground tabular-nums",
          size === "lg" ? "text-4xl" : "text-2xl"
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "text-xs uppercase tracking-widest text-foreground/40",
          size === "lg" && "mt-1"
        )}
      >
        {label}
      </div>
    </div>
  );
}
