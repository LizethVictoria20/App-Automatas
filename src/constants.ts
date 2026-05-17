import { TMConfig } from "./types";

export const EXAMPLES: Record<string, TMConfig> = {
  binaryIncrement: {
    tape: ["1", "0", "1", "1"],
    initialState: "q0",
    blankSymbol: "_",
    transitions: [
      {
        currentState: "q0",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "q0",
      },
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "q0",
      },
      {
        currentState: "q0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "L",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "1",
        writeSymbol: "0",
        move: "L",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "0",
        writeSymbol: "1",
        move: "N",
        nextState: "accept",
      },
      {
        currentState: "q1",
        readSymbol: "_",
        writeSymbol: "1",
        move: "N",
        nextState: "accept",
      },
    ],
  },
  palindrome: {
    tape: ["a", "b", "b", "a"],
    initialState: "q0",
    blankSymbol: "_",
    transitions: [
      {
        currentState: "q0",
        readSymbol: "a",
        writeSymbol: "_",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q0",
        readSymbol: "b",
        writeSymbol: "_",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },

      {
        currentState: "q1",
        readSymbol: "a",
        writeSymbol: "a",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "b",
        writeSymbol: "b",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "_",
        writeSymbol: "_",
        move: "L",
        nextState: "q3",
      },

      {
        currentState: "q2",
        readSymbol: "a",
        writeSymbol: "a",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q2",
        readSymbol: "b",
        writeSymbol: "b",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q2",
        readSymbol: "_",
        writeSymbol: "_",
        move: "L",
        nextState: "q4",
      },

      {
        currentState: "q3",
        readSymbol: "a",
        writeSymbol: "_",
        move: "L",
        nextState: "q5",
      },
      {
        currentState: "q3",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },
      {
        currentState: "q3",
        readSymbol: "b",
        writeSymbol: "b",
        move: "N",
        nextState: "reject",
      },

      {
        currentState: "q4",
        readSymbol: "b",
        writeSymbol: "_",
        move: "L",
        nextState: "q5",
      },
      {
        currentState: "q4",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },
      {
        currentState: "q4",
        readSymbol: "a",
        writeSymbol: "a",
        move: "N",
        nextState: "reject",
      },

      {
        currentState: "q5",
        readSymbol: "a",
        writeSymbol: "a",
        move: "L",
        nextState: "q5",
      },
      {
        currentState: "q5",
        readSymbol: "b",
        writeSymbol: "b",
        move: "L",
        nextState: "q5",
      },
      {
        currentState: "q5",
        readSymbol: "_",
        writeSymbol: "_",
        move: "R",
        nextState: "q0",
      },
    ],
  },
  unaryAddition: {
    tape: ["1", "1", "+", "1", "1", "1"],
    initialState: "q0",
    blankSymbol: "_",
    transitions: [
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "q0",
      },
      {
        currentState: "q0",
        readSymbol: "+",
        writeSymbol: "1",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "_",
        writeSymbol: "_",
        move: "L",
        nextState: "q2",
      },
      {
        currentState: "q2",
        readSymbol: "1",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },
    ],
  },
  repeat01: {
    // Recognizer for (01)* ; accepts empty tape as well.
    tape: ["0", "1", "0", "1"],
    initialState: "q0",
    blankSymbol: "_",
    transitions: [
      {
        currentState: "q0",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "1",
        move: "N",
        nextState: "reject",
      },

      {
        currentState: "q1",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "q0",
      },
      {
        currentState: "q1",
        readSymbol: "0",
        writeSymbol: "0",
        move: "N",
        nextState: "reject",
      },
      {
        currentState: "q1",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },
    ],
  },

  copyOnes: {
    // Copies a block of 1s separated by a blank: input 111 -> output 111_111
    tape: ["1", "1", "1"],
    initialState: "q0",
    blankSymbol: "_",
    transitions: [
      // Move to the end, add a separator blank, then start copying
      {
        currentState: "q0",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "q0",
      },
      {
        currentState: "q0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "L",
        nextState: "qFind",
      },

      // Find a not-yet-copied 1 on the left block.
      // Mark it as X, then go to end and append 1.
      {
        currentState: "qFind",
        readSymbol: "1",
        writeSymbol: "X",
        move: "R",
        nextState: "qToEnd",
      },
      {
        currentState: "qFind",
        readSymbol: "X",
        writeSymbol: "X",
        move: "L",
        nextState: "qFind",
      },
      {
        currentState: "qFind",
        readSymbol: "_",
        writeSymbol: "_",
        move: "R",
        nextState: "qRestore",
      },

      // Move right to the end of tape (past any copied 1s), append 1, return.
      {
        currentState: "qToEnd",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "qToEnd",
      },
      {
        currentState: "qToEnd",
        readSymbol: "X",
        writeSymbol: "X",
        move: "R",
        nextState: "qToEnd",
      },
      {
        currentState: "qToEnd",
        readSymbol: "_",
        writeSymbol: "_",
        move: "R",
        nextState: "qSep",
      },

      // Ensure a single separator blank between blocks.
      {
        currentState: "qSep",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "qSep",
      },
      {
        currentState: "qSep",
        readSymbol: "_",
        writeSymbol: "1",
        move: "L",
        nextState: "qBack",
      },

      // Go back left to start finding next 1
      {
        currentState: "qBack",
        readSymbol: "1",
        writeSymbol: "1",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "_",
        writeSymbol: "_",
        move: "L",
        nextState: "qBack2",
      },
      {
        currentState: "qBack2",
        readSymbol: "1",
        writeSymbol: "1",
        move: "L",
        nextState: "qBack2",
      },
      {
        currentState: "qBack2",
        readSymbol: "X",
        writeSymbol: "X",
        move: "L",
        nextState: "qBack2",
      },
      {
        currentState: "qBack2",
        readSymbol: "_",
        writeSymbol: "_",
        move: "R",
        nextState: "qFind",
      },

      // Restore X -> 1 then accept
      {
        currentState: "qRestore",
        readSymbol: "X",
        writeSymbol: "1",
        move: "R",
        nextState: "qRestore",
      },
      {
        currentState: "qRestore",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "qRestore",
      },
      {
        currentState: "qRestore",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },
    ],
  },

  divisibleBy3Binary: {
    // Recognizer for binary strings divisible by 3 (MSB first). Accepts 0 as divisible.
    // Uses DFA states for remainder mod 3.
    tape: ["1", "1", "0"], // 6
    initialState: "r0",
    blankSymbol: "_",
    transitions: [
      // r0
      {
        currentState: "r0",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "r0",
      },
      {
        currentState: "r0",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "r1",
      },
      {
        currentState: "r0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },

      // r1
      {
        currentState: "r1",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "r2",
      },
      {
        currentState: "r1",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "r0",
      },
      {
        currentState: "r1",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },

      // r2
      {
        currentState: "r2",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "r1",
      },
      {
        currentState: "r2",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "r2",
      },
      {
        currentState: "r2",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },
    ],
  },

  divisibleBy3Base10: {
    // Recognizer for decimal strings divisible by 3.
    // Note: A number is divisible by 3 iff sum of digits is divisible by 3.
    // We track the remainder of sum mod 3 while scanning.
    tape: ["1", "2"], // 12
    initialState: "s0",
    blankSymbol: "_",
    transitions: [
      // Digits with value mod 3 = 0: 0,3,6,9
      {
        currentState: "s0",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s0",
        readSymbol: "3",
        writeSymbol: "3",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s0",
        readSymbol: "6",
        writeSymbol: "6",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s0",
        readSymbol: "9",
        writeSymbol: "9",
        move: "R",
        nextState: "s0",
      },
      // mod 3 = 1: 1,4,7
      {
        currentState: "s0",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s0",
        readSymbol: "4",
        writeSymbol: "4",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s0",
        readSymbol: "7",
        writeSymbol: "7",
        move: "R",
        nextState: "s1",
      },
      // mod 3 = 2: 2,5,8
      {
        currentState: "s0",
        readSymbol: "2",
        writeSymbol: "2",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s0",
        readSymbol: "5",
        writeSymbol: "5",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s0",
        readSymbol: "8",
        writeSymbol: "8",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },

      // s1
      {
        currentState: "s1",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s1",
        readSymbol: "3",
        writeSymbol: "3",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s1",
        readSymbol: "6",
        writeSymbol: "6",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s1",
        readSymbol: "9",
        writeSymbol: "9",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s1",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s1",
        readSymbol: "4",
        writeSymbol: "4",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s1",
        readSymbol: "7",
        writeSymbol: "7",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s1",
        readSymbol: "2",
        writeSymbol: "2",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s1",
        readSymbol: "5",
        writeSymbol: "5",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s1",
        readSymbol: "8",
        writeSymbol: "8",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s1",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },

      // s2
      {
        currentState: "s2",
        readSymbol: "0",
        writeSymbol: "0",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s2",
        readSymbol: "3",
        writeSymbol: "3",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s2",
        readSymbol: "6",
        writeSymbol: "6",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s2",
        readSymbol: "9",
        writeSymbol: "9",
        move: "R",
        nextState: "s2",
      },
      {
        currentState: "s2",
        readSymbol: "1",
        writeSymbol: "1",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s2",
        readSymbol: "4",
        writeSymbol: "4",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s2",
        readSymbol: "7",
        writeSymbol: "7",
        move: "R",
        nextState: "s0",
      },
      {
        currentState: "s2",
        readSymbol: "2",
        writeSymbol: "2",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s2",
        readSymbol: "5",
        writeSymbol: "5",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s2",
        readSymbol: "8",
        writeSymbol: "8",
        move: "R",
        nextState: "s1",
      },
      {
        currentState: "s2",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },
    ],
  },

  threeEqualLength: {
    // Recognizer for languages of the form a^n b^n c^n.
    // Marks matched triples using X,Y,Z.
    tape: ["a", "a", "b", "b", "c", "c"],
    initialState: "q0",
    blankSymbol: "_",
    transitions: [
      // Find next 'a'
      {
        currentState: "q0",
        readSymbol: "X",
        writeSymbol: "X",
        move: "R",
        nextState: "q0",
      },
      {
        currentState: "q0",
        readSymbol: "a",
        writeSymbol: "X",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q0",
        readSymbol: "b",
        writeSymbol: "b",
        move: "N",
        nextState: "qCheckB",
      },
      {
        currentState: "q0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },

      // Find next unmatched b
      {
        currentState: "q1",
        readSymbol: "a",
        writeSymbol: "a",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "X",
        writeSymbol: "X",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "Y",
        writeSymbol: "Y",
        move: "R",
        nextState: "q1",
      },
      {
        currentState: "q1",
        readSymbol: "b",
        writeSymbol: "Y",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q1",
        readSymbol: "c",
        writeSymbol: "c",
        move: "N",
        nextState: "reject",
      },
      {
        currentState: "q1",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },

      // Find next unmatched c
      {
        currentState: "q2",
        readSymbol: "b",
        writeSymbol: "b",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q2",
        readSymbol: "Y",
        writeSymbol: "Y",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q2",
        readSymbol: "Z",
        writeSymbol: "Z",
        move: "R",
        nextState: "q2",
      },
      {
        currentState: "q2",
        readSymbol: "c",
        writeSymbol: "Z",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "q2",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "reject",
      },

      // Go back to start (left end)
      {
        currentState: "qBack",
        readSymbol: "a",
        writeSymbol: "a",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "b",
        writeSymbol: "b",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "c",
        writeSymbol: "c",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "X",
        writeSymbol: "X",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "Y",
        writeSymbol: "Y",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "Z",
        writeSymbol: "Z",
        move: "L",
        nextState: "qBack",
      },
      {
        currentState: "qBack",
        readSymbol: "_",
        writeSymbol: "_",
        move: "R",
        nextState: "q0",
      },

      // After all a's are marked, ensure no unmarked b/c remain
      {
        currentState: "qCheckB",
        readSymbol: "X",
        writeSymbol: "X",
        move: "R",
        nextState: "qCheckB",
      },
      {
        currentState: "qCheckB",
        readSymbol: "Y",
        writeSymbol: "Y",
        move: "R",
        nextState: "qCheckB",
      },
      {
        currentState: "qCheckB",
        readSymbol: "Z",
        writeSymbol: "Z",
        move: "R",
        nextState: "qCheckB",
      },
      {
        currentState: "qCheckB",
        readSymbol: "b",
        writeSymbol: "b",
        move: "N",
        nextState: "reject",
      },
      {
        currentState: "qCheckB",
        readSymbol: "c",
        writeSymbol: "c",
        move: "N",
        nextState: "reject",
      },
      {
        currentState: "qCheckB",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },
    ],
  },
};
