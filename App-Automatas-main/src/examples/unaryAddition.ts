import { TMConfig } from "../types";

export const unaryAddition: TMConfig = {
  title: "Suma unaria",
  description:
    'Suma dos números en representación unaria separados por "+" (ej. 11+111). Reemplaza el separador y ajusta el final para obtener el resultado.',
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
};
