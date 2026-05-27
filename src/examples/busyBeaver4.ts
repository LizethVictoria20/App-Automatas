import { TMConfig } from "../types";

export const busyBeaver4: TMConfig = {
  title: "Busy Beaver de 4 Estados",
  description:
    "El campeón BB(4) que escribe 13 unos en 107 pasos. Este es el último Busy Beaver conocido con certeza matemática.",
  tape: ["_"],
  initialState: "A",
  blankSymbol: "_",
  transitions: [
    // Estado A
    { currentState: "A", readSymbol: "_", writeSymbol: "1", move: "R", nextState: "B" },
    { currentState: "A", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "B" },
    
    // Estado B
    { currentState: "B", readSymbol: "_", writeSymbol: "1", move: "L", nextState: "A" },
    { currentState: "B", readSymbol: "1", writeSymbol: "_", move: "L", nextState: "C" },
    
    // Estado C
    { currentState: "C", readSymbol: "_", writeSymbol: "1", move: "R", nextState: "halt" },
    { currentState: "C", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "D" },
    
    // Estado D
    { currentState: "D", readSymbol: "_", writeSymbol: "1", move: "R", nextState: "D" },
    { currentState: "D", readSymbol: "1", writeSymbol: "_", move: "R", nextState: "A" },
  ],
};
