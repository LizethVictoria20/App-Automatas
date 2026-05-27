import { TMConfig } from "../types";

export const powersOfTwo: TMConfig = {
  title: "Potencias de 2",
  description:
    "Verifica si un número unario es una potencia de 2 (2, 4, 8, 16...). Divide repetidamente por 2 hasta llegar a 1 o detectar que no es divisible.",
  tape: ["1", "1", "1", "1", "1", "1", "1", "1"], // 8 unos = 2^3
  initialState: "q0",
  blankSymbol: "_",
  transitions: [
    // Caso especial: un solo 1 es 2^0, se acepta
    { currentState: "q0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q1" },
    { currentState: "q1", readSymbol: "_", writeSymbol: "_", move: "N", nextState: "accept" },
    
    // Marca cada segundo 1
    { currentState: "q1", readSymbol: "1", writeSymbol: "X", move: "R", nextState: "q2" },
    
    // Salta el siguiente 1
    { currentState: "q2", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q1" },
    { currentState: "q2", readSymbol: "_", writeSymbol: "_", move: "L", nextState: "q3" },
    { currentState: "q2", readSymbol: "X", writeSymbol: "X", move: "R", nextState: "q2" },
    
    // Verifica si quedan 1s sin marcar (número impar, no es potencia de 2)
    { currentState: "q3", readSymbol: "1", writeSymbol: "1", move: "N", nextState: "reject" },
    { currentState: "q3", readSymbol: "X", writeSymbol: "X", move: "L", nextState: "q3" },
    { currentState: "q3", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "q4" },
    
    // Convierte X en 1 para la siguiente iteración
    { currentState: "q4", readSymbol: "X", writeSymbol: "1", move: "R", nextState: "q4" },
    { currentState: "q4", readSymbol: "_", writeSymbol: "_", move: "L", nextState: "q5" },
    
    // Regresa al inicio
    { currentState: "q5", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q5" },
    { currentState: "q5", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "q0" },
  ],
};
