import { TMConfig } from "./types";

export const EXAMPLES: Record<string, TMConfig> = {
  binaryIncrement: {
    tape: ['1', '0', '1', '1'],
    initialState: 'q0',
    blankSymbol: '_',
    transitions: [
      { currentState: 'q0', readSymbol: '0', writeSymbol: '0', move: 'R', nextState: 'q0' },
      { currentState: 'q0', readSymbol: '1', writeSymbol: '1', move: 'R', nextState: 'q0' },
      { currentState: 'q0', readSymbol: '_', writeSymbol: '_', move: 'L', nextState: 'q1' },
      { currentState: 'q1', readSymbol: '1', writeSymbol: '0', move: 'L', nextState: 'q1' },
      { currentState: 'q1', readSymbol: '0', writeSymbol: '1', move: 'N', nextState: 'accept' },
      { currentState: 'q1', readSymbol: '_', writeSymbol: '1', move: 'N', nextState: 'accept' },
    ],
  },
  palindrome: {
    tape: ['a', 'b', 'b', 'a'],
    initialState: 'q0',
    blankSymbol: '_',
    transitions: [
      { currentState: 'q0', readSymbol: 'a', writeSymbol: '_', move: 'R', nextState: 'q1' },
      { currentState: 'q0', readSymbol: 'b', writeSymbol: '_', move: 'R', nextState: 'q2' },
      { currentState: 'q0', readSymbol: '_', writeSymbol: '_', move: 'N', nextState: 'accept' },
      
      { currentState: 'q1', readSymbol: 'a', writeSymbol: 'a', move: 'R', nextState: 'q1' },
      { currentState: 'q1', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'q1' },
      { currentState: 'q1', readSymbol: '_', writeSymbol: '_', move: 'L', nextState: 'q3' },
      
      { currentState: 'q2', readSymbol: 'a', writeSymbol: 'a', move: 'R', nextState: 'q2' },
      { currentState: 'q2', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'q2' },
      { currentState: 'q2', readSymbol: '_', writeSymbol: '_', move: 'L', nextState: 'q4' },
      
      { currentState: 'q3', readSymbol: 'a', writeSymbol: '_', move: 'L', nextState: 'q5' },
      { currentState: 'q3', readSymbol: '_', writeSymbol: '_', move: 'N', nextState: 'reject' },
      { currentState: 'q3', readSymbol: 'b', writeSymbol: 'b', move: 'N', nextState: 'reject' },

      { currentState: 'q4', readSymbol: 'b', writeSymbol: '_', move: 'L', nextState: 'q5' },
      { currentState: 'q4', readSymbol: '_', writeSymbol: '_', move: 'N', nextState: 'reject' },
      { currentState: 'q4', readSymbol: 'a', writeSymbol: 'a', move: 'N', nextState: 'reject' },

      { currentState: 'q5', readSymbol: 'a', writeSymbol: 'a', move: 'L', nextState: 'q5' },
      { currentState: 'q5', readSymbol: 'b', writeSymbol: 'b', move: 'L', nextState: 'q5' },
      { currentState: 'q5', readSymbol: '_', writeSymbol: '_', move: 'R', nextState: 'q0' },
    ],
  },
  unaryAddition: {
    tape: ['1', '1', '+', '1', '1', '1'],
    initialState: 'q0',
    blankSymbol: '_',
    transitions: [
      { currentState: 'q0', readSymbol: '1', writeSymbol: '1', move: 'R', nextState: 'q0' },
      { currentState: 'q0', readSymbol: '+', writeSymbol: '1', move: 'R', nextState: 'q1' },
      { currentState: 'q1', readSymbol: '1', writeSymbol: '1', move: 'R', nextState: 'q1' },
      { currentState: 'q1', readSymbol: '_', writeSymbol: '_', move: 'L', nextState: 'q2' },
      { currentState: 'q2', readSymbol: '1', writeSymbol: '_', move: 'N', nextState: 'accept' },
    ],
  }
};
