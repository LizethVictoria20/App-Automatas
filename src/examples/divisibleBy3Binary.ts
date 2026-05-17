import { TMConfig } from "../types";

export const divisibleBy3Binary: TMConfig = {
  title: "Divisible por 3 (binario)",
  description:
    "Acepta si el número binario (MSB primero) es divisible por 3. Mantiene el residuo módulo 3 mientras escanea de izquierda a derecha.",
  tape: ["1", "1", "0"],
  initialState: "r0",
  blankSymbol: "_",
  transitions: [
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
};
