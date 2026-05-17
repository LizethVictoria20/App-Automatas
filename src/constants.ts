import type { TMConfig } from "./types";

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
  },
  busyBeaver: {
    tape: ['0'],
    initialState: 'A',
    blankSymbol: '0',
    transitions: [
      // State A
      { currentState: 'A', readSymbol: '0', writeSymbol: '1', move: 'R', nextState: 'B' },
      { currentState: 'A', readSymbol: '1', writeSymbol: '1', move: 'L', nextState: 'C' },
      
      // State B
      { currentState: 'B', readSymbol: '0', writeSymbol: '1', move: 'L', nextState: 'A' },
      { currentState: 'B', readSymbol: '1', writeSymbol: '1', move: 'R', nextState: 'H' },
      
      // State C
      { currentState: 'C', readSymbol: '0', writeSymbol: '1', move: 'L', nextState: 'B' },
      { currentState: 'C', readSymbol: '1', writeSymbol: '1', move: 'R', nextState: 'H' },
      
      // State H (Halt - no transitions needed)
    ],
  },
  
  // Ejercicio 12: 3-state busy beaver (alternative variant - 21 steps, 5 ones)
  // This explores the question: among all possible Turing machines with n states 
  // and k symbols, which one produces the most output (symbols written or steps taken)?
  // Formula for possible TMs: (2k(n+1))^(nk) where n=states, k=symbols
  exercise12: {
    tape: ['0'],
    initialState: 'A',
    blankSymbol: '0',
    transitions: [
      // State A
      { currentState: 'A', readSymbol: '0', writeSymbol: '1', move: 'R', nextState: 'B' },
      { currentState: 'A', readSymbol: '1', writeSymbol: '1', move: 'R', nextState: 'H' },
      
      // State B
      { currentState: 'B', readSymbol: '0', writeSymbol: '1', move: 'L', nextState: 'B' },
      { currentState: 'B', readSymbol: '1', writeSymbol: '0', move: 'R', nextState: 'C' },
      
      // State C
      { currentState: 'C', readSymbol: '0', writeSymbol: '1', move: 'L', nextState: 'C' },
      { currentState: 'C', readSymbol: '1', writeSymbol: '1', move: 'L', nextState: 'A' },
      
      // State H (Halt)
    ],
  }
  ,
  // New exercises added from EXERCISES.md
  binaryAddition: {
    tape: ['1','0','1','1','+','1','1','0','0','1'],
    initialState: 'right',
    blankSymbol: ' ',
    transitions: []
  },
  unaryMultiplication: {
    tape: ['|','|','*','|','|','|'],
    initialState: 'eachA',
    blankSymbol: ' ',
    transitions: []
  },
  binaryMultiplication: {
    tape: ['1','1','*','1','0','1'],
    initialState: 'start',
    blankSymbol: ' ',
    transitions: []
  },
  multipliedLengths: {
    tape: ['a','a','b','b','b','c','c','c','c','c','c'],
    initialState: 'start',
    blankSymbol: ' ',
    transitions: [
      { currentState: 'start', readSymbol: 'a', writeSymbol: 'a', move: 'R', nextState: 'a+' },

      { currentState: 'a+', readSymbol: 'a', writeSymbol: 'a', move: 'R', nextState: 'a+' },
      { currentState: 'a+', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'b+' },

      { currentState: 'b+', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'b+' },
      { currentState: 'b+', readSymbol: 'c', writeSymbol: 'c', move: 'R', nextState: 'c+' },

      { currentState: 'c+', readSymbol: 'c', writeSymbol: 'c', move: 'R', nextState: 'c+' },
      { currentState: 'c+', readSymbol: ' ', writeSymbol: ' ', move: 'L', nextState: 'left' },

      { currentState: 'left', readSymbol: 'a', writeSymbol: 'a', move: 'L', nextState: 'left' },
      { currentState: 'left', readSymbol: 'b', writeSymbol: 'b', move: 'L', nextState: 'left' },
      { currentState: 'left', readSymbol: 'c', writeSymbol: 'c', move: 'L', nextState: 'left' },
      { currentState: 'left', readSymbol: ' ', writeSymbol: ' ', move: 'R', nextState: 'eachA' },

      { currentState: 'eachA', readSymbol: 'a', writeSymbol: ' ', move: 'R', nextState: 'eachB' },
      { currentState: 'eachA', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'scan' },

      { currentState: 'eachB', readSymbol: 'a', writeSymbol: 'a', move: 'R', nextState: 'eachB' },
      { currentState: 'eachB', readSymbol: 'b', writeSymbol: 'B', move: 'R', nextState: 'markC' },
      { currentState: 'eachB', readSymbol: 'C', writeSymbol: 'C', move: 'L', nextState: 'nextA' },

      { currentState: 'markC', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'markC' },
      { currentState: 'markC', readSymbol: 'C', writeSymbol: 'C', move: 'R', nextState: 'markC' },
      { currentState: 'markC', readSymbol: 'c', writeSymbol: 'C', move: 'L', nextState: 'nextB' },

      { currentState: 'nextB', readSymbol: 'b', writeSymbol: 'b', move: 'L', nextState: 'nextB' },
      { currentState: 'nextB', readSymbol: 'C', writeSymbol: 'C', move: 'L', nextState: 'nextB' },
      { currentState: 'nextB', readSymbol: 'B', writeSymbol: 'B', move: 'R', nextState: 'eachB' },

      { currentState: 'nextA', readSymbol: 'a', writeSymbol: 'a', move: 'L', nextState: 'nextA' },
      { currentState: 'nextA', readSymbol: 'B', writeSymbol: 'b', move: 'L', nextState: 'nextA' },
      { currentState: 'nextA', readSymbol: ' ', writeSymbol: ' ', move: 'R', nextState: 'eachA' },

      { currentState: 'scan', readSymbol: 'b', writeSymbol: 'b', move: 'R', nextState: 'scan' },
      { currentState: 'scan', readSymbol: 'C', writeSymbol: 'C', move: 'R', nextState: 'scan' },
      { currentState: 'scan', readSymbol: ' ', writeSymbol: ' ', move: 'R', nextState: 'accept' },
    ]
  }
};
