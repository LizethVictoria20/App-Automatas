import { TMConfig } from "../types";

export const binaryMultiplication: TMConfig = {
  title: "Multiplicación Binaria",
  description:
    "Multiplica dos números binarios separados por '*'. Ejemplo: '11*10' (3×2) produce '110' (6). Usa el algoritmo de suma repetida y desplazamiento.",
  tape: ["1", "1", "*", "1", "0"],
  initialState: "q0",
  blankSymbol: "_",
  transitions: [
    // Inicializar: ir al final y agregar '='
    { currentState: "q0", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "*", writeSymbol: "*", move: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "_", writeSymbol: "=", move: "L", nextState: "q1" },
    
    // Procesar cada bit del multiplicador (de derecha a izquierda)
    { currentState: "q1", readSymbol: "0", writeSymbol: "X", move: "L", nextState: "q_skip" },
    { currentState: "q1", readSymbol: "1", writeSymbol: "X", move: "L", nextState: "q2" },
    { currentState: "q1", readSymbol: "*", writeSymbol: "*", move: "L", nextState: "q_end" },
    
    // Si es 1, copiar el multiplicando desplazado
    { currentState: "q2", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q2" },
    { currentState: "q2", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q2" },
    { currentState: "q2", readSymbol: "X", writeSymbol: "X", move: "L", nextState: "q2" },
    { currentState: "q2", readSymbol: "*", writeSymbol: "*", move: "L", nextState: "q3" },
    
    // Marcar bit del multiplicando
    { currentState: "q3", readSymbol: "0", writeSymbol: "Y", move: "R", nextState: "q4_0" },
    { currentState: "q3", readSymbol: "1", writeSymbol: "Y", move: "R", nextState: "q4_1" },
    { currentState: "q3", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "q3" },
    { currentState: "q3", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "q_restore" },
    
    // Ir a escribir en resultado (bit 0)
    { currentState: "q4_0", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q4_0" },
    { currentState: "q4_0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q4_0" },
    { currentState: "q4_0", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "q4_0" },
    { currentState: "q4_0", readSymbol: "*", writeSymbol: "*", move: "R", nextState: "q5_0" },
    
    { currentState: "q5_0", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q5_0" },
    { currentState: "q5_0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q5_0" },
    { currentState: "q5_0", readSymbol: "X", writeSymbol: "X", move: "R", nextState: "q5_0" },
    { currentState: "q5_0", readSymbol: "=", writeSymbol: "=", move: "R", nextState: "q6_0" },
    
    { currentState: "q6_0", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q6_0" },
    { currentState: "q6_0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q6_0" },
    { currentState: "q6_0", readSymbol: "_", writeSymbol: "0", move: "L", nextState: "q_back" },
    
    // Ir a escribir en resultado (bit 1)
    { currentState: "q4_1", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q4_1" },
    { currentState: "q4_1", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q4_1" },
    { currentState: "q4_1", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "q4_1" },
    { currentState: "q4_1", readSymbol: "*", writeSymbol: "*", move: "R", nextState: "q5_1" },
    
    { currentState: "q5_1", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q5_1" },
    { currentState: "q5_1", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q5_1" },
    { currentState: "q5_1", readSymbol: "X", writeSymbol: "X", move: "R", nextState: "q5_1" },
    { currentState: "q5_1", readSymbol: "=", writeSymbol: "=", move: "R", nextState: "q6_1" },
    
    { currentState: "q6_1", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q6_1" },
    { currentState: "q6_1", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q6_1" },
    { currentState: "q6_1", readSymbol: "_", writeSymbol: "1", move: "L", nextState: "q_back" },
    
    // Regresar al multiplicando
    { currentState: "q_back", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q_back" },
    { currentState: "q_back", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q_back" },
    { currentState: "q_back", readSymbol: "=", writeSymbol: "=", move: "L", nextState: "q_back" },
    { currentState: "q_back", readSymbol: "X", writeSymbol: "X", move: "L", nextState: "q_back" },
    { currentState: "q_back", readSymbol: "*", writeSymbol: "*", move: "L", nextState: "q_back2" },
    
    { currentState: "q_back2", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q_back2" },
    { currentState: "q_back2", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q_back2" },
    { currentState: "q_back2", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "q_back2" },
    { currentState: "q_back2", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "q3" },
    
    // Restaurar multiplicando
    { currentState: "q_restore", readSymbol: "Y", writeSymbol: "1", move: "R", nextState: "q_restore" },
    { currentState: "q_restore", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q_restore" },
    { currentState: "q_restore", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q_restore" },
    { currentState: "q_restore", readSymbol: "*", writeSymbol: "*", move: "R", nextState: "q_next" },
    
    { currentState: "q_next", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q_next" },
    { currentState: "q_next", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q_next" },
    { currentState: "q_next", readSymbol: "X", writeSymbol: "X", move: "L", nextState: "q1" },
    
    // Si el bit es 0, solo agregar un 0 al resultado
    { currentState: "q_skip", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q_skip" },
    { currentState: "q_skip", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q_skip" },
    { currentState: "q_skip", readSymbol: "X", writeSymbol: "X", move: "L", nextState: "q_skip" },
    { currentState: "q_skip", readSymbol: "*", writeSymbol: "*", move: "R", nextState: "q_skip2" },
    
    { currentState: "q_skip2", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q_skip2" },
    { currentState: "q_skip2", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q_skip2" },
    { currentState: "q_skip2", readSymbol: "X", writeSymbol: "X", move: "R", nextState: "q_skip2" },
    { currentState: "q_skip2", readSymbol: "=", writeSymbol: "=", move: "R", nextState: "q_skip3" },
    
    { currentState: "q_skip3", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q_skip3" },
    { currentState: "q_skip3", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q_skip3" },
    { currentState: "q_skip3", readSymbol: "_", writeSymbol: "0", move: "L", nextState: "q_skip4" },
    
    { currentState: "q_skip4", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q_skip4" },
    { currentState: "q_skip4", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q_skip4" },
    { currentState: "q_skip4", readSymbol: "=", writeSymbol: "=", move: "L", nextState: "q_skip4" },
    { currentState: "q_skip4", readSymbol: "X", writeSymbol: "X", move: "L", nextState: "q1" },
    
    // Limpieza final
    { currentState: "q_end", readSymbol: "0", writeSymbol: "_", move: "L", nextState: "q_end" },
    { currentState: "q_end", readSymbol: "1", writeSymbol: "_", move: "L", nextState: "q_end" },
    { currentState: "q_end", readSymbol: "Y", writeSymbol: "_", move: "L", nextState: "q_end" },
    { currentState: "q_end", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "qfinal" },
    
    { currentState: "qfinal", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "qfinal" },
    { currentState: "qfinal", readSymbol: "*", writeSymbol: "_", move: "R", nextState: "qfinal" },
    { currentState: "qfinal", readSymbol: "X", writeSymbol: "_", move: "R", nextState: "qfinal" },
    { currentState: "qfinal", readSymbol: "=", writeSymbol: "_", move: "R", nextState: "accept" },
  ],
};
