// src/examples.ts

import { TMConfig } from "./types";

export const EXAMPLES: Record<string, TMConfig & { title: string; description: string }> = {

  binaryIncrement: {
    title: "Incremento Binario",
    description: "Incrementa un número binario en 1",
    tape: ["1", "0", "1"],
    blankSymbol: "0",
    initialState: "q0",
    transitions: [
      { currentState: "q0", readSymbol: "1", writeSymbol: "0", move: "L", nextState: "q0" },
      { currentState: "q0", readSymbol: "0", writeSymbol: "1", move: "R", nextState: "halt" },
    ],
  },

  // 🔥 EJERCICIO 12 - BUSY BEAVER
  busyBeaver: {
    title: "3-State Busy Beaver",
    description: `
El Busy Beaver busca la máquina de Turing que escribe más símbolos antes de detenerse.

Esta máquina:
- Usa estados A, B, C
- Se detiene en H
- Ejecuta 21 pasos
- Deja símbolos '1' en la cinta
    `,
    tape: ["0", "0", "0", "0", "0"],
    blankSymbol: "0",
    initialState: "A",
    transitions: [
      { currentState: "A", readSymbol: "0", writeSymbol: "1", move: "R", nextState: "B" },
      { currentState: "A", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "H" },

      { currentState: "B", readSymbol: "0", writeSymbol: "1", move: "L", nextState: "B" },
      { currentState: "B", readSymbol: "1", writeSymbol: "0", move: "R", nextState: "C" },

      { currentState: "C", readSymbol: "0", writeSymbol: "1", move: "L", nextState: "C" },
      { currentState: "C", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "A" },
    ],
  },
};