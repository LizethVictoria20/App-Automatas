export type Symbol = string;

export interface Transition {
  currentState: string;
  readSymbol: Symbol;
  writeSymbol: Symbol;
  move: "L" | "R" | "N";
  nextState: string;
}

export interface TMConfig {
  /** Initial tape contents */
  tape: Symbol[];
  /** Starting state */
  initialState: string;
  transitions: Transition[];
  blankSymbol: Symbol;

  /** Optional metadata for UI (examples/exercises) */
  title?: string;
  description?: string;
}

export interface TMState {
  tape: Symbol[];
  headIndex: number;
  currentState: string;
  isRunning: boolean;
  stepCount: number;
  isHalted: boolean;
}
