import { TMConfig } from "../types";

export const equalStrings: TMConfig = {
  title: "Cadenas Iguales",
  description:
    "Verifica que dos cadenas separadas por '#' sean idénticas. Ejemplo: 'abc#abc' es aceptado, 'abc#abd' es rechazado.",
  tape: ["a", "b", "c", "#", "a", "b", "c"],
  initialState: "q0",
  blankSymbol: "_",
  transitions: [
    // Marca el primer símbolo de la primera cadena
    { currentState: "q0", readSymbol: "a", writeSymbol: "X", move: "R", nextState: "qa" },
    { currentState: "q0", readSymbol: "b", writeSymbol: "X", move: "R", nextState: "qb" },
    { currentState: "q0", readSymbol: "c", writeSymbol: "X", move: "R", nextState: "qc" },
    { currentState: "q0", readSymbol: "#", writeSymbol: "#", move: "R", nextState: "qcheck" },
    
    // Busca 'a' después del separador
    { currentState: "qa", readSymbol: "a", writeSymbol: "a", move: "R", nextState: "qa" },
    { currentState: "qa", readSymbol: "b", writeSymbol: "b", move: "R", nextState: "qa" },
    { currentState: "qa", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "qa" },
    { currentState: "qa", readSymbol: "#", writeSymbol: "#", move: "R", nextState: "qa2" },
    { currentState: "qa2", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "qa2" },
    { currentState: "qa2", readSymbol: "a", writeSymbol: "Y", move: "L", nextState: "qback" },
    
    // Busca 'b' después del separador
    { currentState: "qb", readSymbol: "a", writeSymbol: "a", move: "R", nextState: "qb" },
    { currentState: "qb", readSymbol: "b", writeSymbol: "b", move: "R", nextState: "qb" },
    { currentState: "qb", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "qb" },
    { currentState: "qb", readSymbol: "#", writeSymbol: "#", move: "R", nextState: "qb2" },
    { currentState: "qb2", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "qb2" },
    { currentState: "qb2", readSymbol: "b", writeSymbol: "Y", move: "L", nextState: "qback" },
    
    // Busca 'c' después del separador
    { currentState: "qc", readSymbol: "a", writeSymbol: "a", move: "R", nextState: "qc" },
    { currentState: "qc", readSymbol: "b", writeSymbol: "b", move: "R", nextState: "qc" },
    { currentState: "qc", readSymbol: "c", writeSymbol: "c", move: "R", nextState: "qc" },
    { currentState: "qc", readSymbol: "#", writeSymbol: "#", move: "R", nextState: "qc2" },
    { currentState: "qc2", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "qc2" },
    { currentState: "qc2", readSymbol: "c", writeSymbol: "Y", move: "L", nextState: "qback" },
    
    // Regresa al inicio
    { currentState: "qback", readSymbol: "a", writeSymbol: "a", move: "L", nextState: "qback" },
    { currentState: "qback", readSymbol: "b", writeSymbol: "b", move: "L", nextState: "qback" },
    { currentState: "qback", readSymbol: "c", writeSymbol: "c", move: "L", nextState: "qback" },
    { currentState: "qback", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "qback" },
    { currentState: "qback", readSymbol: "#", writeSymbol: "#", move: "L", nextState: "qback" },
    { currentState: "qback", readSymbol: "X", writeSymbol: "X", move: "R", nextState: "q0" },
    
    // Verifica que ambas cadenas estén completamente marcadas
    { currentState: "qcheck", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "qcheck" },
    { currentState: "qcheck", readSymbol: "_", writeSymbol: "_", move: "N", nextState: "accept" },
  ],
};
