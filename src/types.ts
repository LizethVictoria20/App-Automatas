export type Symbol = string;

export interface Transition {
  currentState: string;
  readSymbol: Symbol;
  writeSymbol: Symbol;
  move: 'L' | 'R' | 'N';
  nextState: string;
}

export interface TMConfig {
  tape: Symbol[];
  initialState: string;
  transitions: Transition[];
  blankSymbol: Symbol;
}

export interface TMState {
  tape: Symbol[];
  headIndex: number;
  currentState: string;
  isRunning: boolean;
  stepCount: number;
  isHalted: boolean;
}
