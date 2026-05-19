import { TMConfig } from "../types";

export const binaryIncrement: TMConfig = {
  title: "Incremento binario",
  description:
    "Suma 1 a un número binario en la cinta (ej. 1011 → 1100). Recorre al final y propaga el acarreo hacia la izquierda.",
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
};
