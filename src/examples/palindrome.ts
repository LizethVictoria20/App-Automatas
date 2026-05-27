import { TMConfig } from "../types";

export const palindrome: TMConfig = {
  title: "Verificador de palíndromos",
  description:
    "Acepta si la cadena sobre {a,b} se lee igual de izquierda a derecha y viceversa (ej. abba, aba, aa). Va tachando símbolos en los extremos y comparando. ⚠️ Solo funciona con los símbolos 'a' y 'b'.",
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
};
