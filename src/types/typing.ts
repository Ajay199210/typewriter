export type CharStatus = "untyped" | "correct" | "incorrect";

export interface WpmSnapshot {
  second: number;
  wpm: number;
}
