import { TMConfig } from "../types";

export const repeat01: TMConfig = {
  title: "Repetir 01",
  description:
    'Reconoce el lenguaje (01)*. Acepta cadenas formadas por repeticiones exactas de "01" (incluye la cadena vacía).',
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
};
