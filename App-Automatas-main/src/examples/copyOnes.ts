import { TMConfig } from "../types";

export const copyOnes: TMConfig = {
  title: "Copiar 1s",
  description:
    "Duplica un bloque de 1s: para una entrada 111 produce 111_111. Marca 1s ya copiados (X) y al final los restaura.",
  tape: ["1", "1", "1"],
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
      readSymbol: "_",
      writeSymbol: "_",
      move: "L",
      nextState: "qFind",
    },

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
};
