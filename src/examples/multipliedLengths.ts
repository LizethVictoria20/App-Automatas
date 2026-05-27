import { TMConfig } from "../types";

export const multipliedLengths: TMConfig = {
  title: "Longitudes Multiplicadas (a^(m×n))",
  description:
    "Acepta cadenas donde el número de 'a's es el producto de dos números. Formato: m 'b's, seguidas de n 'c's, seguidas de m×n 'a's. Ejemplo: 'bbcccaaaaaa' (2×3=6).",
  tape: ["b", "b", "c", "c", "c", "a", "a", "a", "a", "a", "a"],
  initialState: "q0",
  blankSymbol: "_",
  transitions: [
    // Marca una b
    { currentState: "q0", readSymbol: "b", writeSymbol: "X", move: "R", nextState: "q1" },
    { currentState: "q0", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "qcheck" },
    
    // Salta las b's restantes
    { currentState: "q1", readSymbol: "b", writeSymbol: "b", move: "R", nextState: "q1" },
    { currentState: "q1", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "q2" },
    
    // Por cada c, marca una a
    { currentState: "q2", readSymbol: "c", writeSymbol: "Y", move: "R", nextState: "q3" },
    { currentState: "q2", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "q2" },
    { currentState: "q2", readSymbol: "a", writeSymbol: "a", move: "L", nextState: "q5" },
    
    // Busca una a para marcar
    { currentState: "q3", readSymbol: "a", writeSymbol: "Z", move: "L", nextState: "q4" },
    { currentState: "q3", readSymbol: "Z", writeSymbol: "Z", move: "R", nextState: "q3" },
    
    // Regresa a las c's
    { currentState: "q4", readSymbol: "a", writeSymbol: "a", move: "L", nextState: "q4" },
    { currentState: "q4", readSymbol: "Z", writeSymbol: "Z", move: "L", nextState: "q4" },
    { currentState: "q4", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "q4" },
    { currentState: "q4", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "q2" },
    
    // Restaura las c's y regresa a las b's
    { currentState: "q5", readSymbol: "Z", writeSymbol: "Z", move: "L", nextState: "q5" },
    { currentState: "q5", readSymbol: "Y", writeSymbol: "c", move: "L", nextState: "q5" },
    { currentState: "q5", readSymbol: "c", writeSymbol: "c", move: "L", nextState: "q5" },
    { currentState: "q5", readSymbol: "b", writeSymbol: "b", move: "L", nextState: "q5" },
    { currentState: "q5", readSymbol: "X", writeSymbol: "X", move: "R", nextState: "q0" },
    
    // Verifica que todas las a's estén marcadas
    { currentState: "qcheck", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "qcheck" },
    { currentState: "qcheck", readSymbol: "Z", writeSymbol: "Z", move: "R", nextState: "qcheck" },
    { currentState: "qcheck", readSymbol: "_", writeSymbol: "_", move: "N", nextState: "accept" },
  ],
};
