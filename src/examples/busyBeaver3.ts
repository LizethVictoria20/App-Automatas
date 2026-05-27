import { TMConfig } from "../types";

export const busyBeaver3: TMConfig = {
  title: "Busy Beaver de 3 Estados",
  description:
    "El campeón BB(3) que escribe 6 unos en 14 pasos. Los Busy Beavers son las máquinas de Turing que escriben el máximo número de unos antes de detenerse.",
  tape: ["_"],
  initialState: "A",
  blankSymbol: "_",
  transitions: [
    // Estado A
    {
      currentState: "A",
      readSymbol: "_",
      writeSymbol: "1",
      move: "R",
      nextState: "B",
    },
    {
      currentState: "A",
      readSymbol: "1",
      writeSymbol: "1",
      move: "L",
      nextState: "C",
    },

    // Estado B
    {
      currentState: "B",
      readSymbol: "_",
      writeSymbol: "1",
      move: "L",
      nextState: "A",
    },
    {
      currentState: "B",
      readSymbol: "1",
      writeSymbol: "1",
      move: "R",
      nextState: "B",
    },

    // Estado C
    {
      currentState: "C",
      readSymbol: "_",
      writeSymbol: "1",
      move: "L",
      nextState: "B",
    },
    {
      currentState: "C",
      readSymbol: "1",
      writeSymbol: "1",
      move: "R",
      nextState: "halt",
    },
  ],
};
