/**
 * Type declarations for the Turing Machine Simulator
 */

export type Direction = 'L' | 'R' | 'N'; // Left, Right, No Movement

export interface TransitionRule {
  id: string; // Unique rule identifier
  fromState: string;
  readSymbol: string;
  writeSymbol: string;
  direction: Direction;
  toState: string;
}

export interface TuringMachineConfig {
  id: string;
  name: string;
  description: string;
  educationalExplanation: string;
  initialState: string;
  acceptStates: string[];
  rejectStates: string[];
  blankSymbol: string;
  initialInput: string;
  rules: TransitionRule[];
  defaultAlphabet: string[];
  // Dynamic rule generator for alphabets
  generateRulesForAlphabet?: (alphabet: string[], blank: string) => TransitionRule[];
}

export type MachineStatus = 'idle' | 'running' | 'paused' | 'accepted' | 'rejected' | 'halted' | 'error';

export interface TapeCell {
  index: number;
  symbol: string;
  isRead: boolean; // Has been read in the current execution?
}

export interface RuntimeState {
  tape: Record<number, string>; // Sparse array representation of infinite tape using indices
  headPosition: number;
  currentState: string;
  stepCount: number;
  status: MachineStatus;
  errorMsg?: string;
  lastRuleId?: string;
  lastDirection?: Direction;
}

export interface StepHistory {
  tape: Record<number, string>;
  headPosition: number;
  currentState: string;
  stepCount: number;
  status: MachineStatus;
  lastRuleId?: string;
  lastDirection?: Direction;
}
