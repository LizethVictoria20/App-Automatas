import { TMConfig } from "../types";

export const binaryAddition: TMConfig = {
  title: "Suma Binaria",
  description:
    "Suma dos números binarios separados por '+'. Ejemplo: '101+11' (5+3) produce '1000' (8). La máquina procesa de derecha a izquierda manejando acarreos.",
  tape: ["1", "0", "1", "+", "1", "1"],
  initialState: "q0",
  blankSymbol: "_",
  transitions: [
    // Ir al final del segundo número
    { currentState: "q0", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "+", writeSymbol: "+", move: "R", nextState: "q0" },
    { currentState: "q0", readSymbol: "_", writeSymbol: "_", move: "L", nextState: "q1" },
    
    // Suma sin acarreo - lee segundo dígito
    { currentState: "q1", readSymbol: "0", writeSymbol: "X", move: "L", nextState: "q2_0" },
    { currentState: "q1", readSymbol: "1", writeSymbol: "X", move: "L", nextState: "q2_1" },
    { currentState: "q1", readSymbol: "+", writeSymbol: "_", move: "L", nextState: "q6" },
    
    // Busca el primer número (leyó 0 en segundo)
    { currentState: "q2_0", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q2_0" },
    { currentState: "q2_0", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q2_0" },
    { currentState: "q2_0", readSymbol: "+", writeSymbol: "+", move: "L", nextState: "q3_0" },
    
    { currentState: "q3_0", readSymbol: "0", writeSymbol: "Y", move: "R", nextState: "q4_0" },
    { currentState: "q3_0", readSymbol: "1", writeSymbol: "Y", move: "R", nextState: "q4_1" },
    { currentState: "q3_0", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "q3_0" },
    
    // Busca el primer número (leyó 1 en segundo)
    { currentState: "q2_1", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "q2_1" },
    { currentState: "q2_1", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "q2_1" },
    { currentState: "q2_1", readSymbol: "+", writeSymbol: "+", move: "L", nextState: "q3_1" },
    
    { currentState: "q3_1", readSymbol: "0", writeSymbol: "Y", move: "R", nextState: "q4_1" },
    { currentState: "q3_1", readSymbol: "1", writeSymbol: "Y", move: "R", nextState: "q4_c" },
    { currentState: "q3_1", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "q3_1" },
    
    // Escribe resultado (0+0=0, 0+1=1, 1+0=1)
    { currentState: "q4_0", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "q4_0" },
    { currentState: "q4_0", readSymbol: "+", writeSymbol: "+", move: "R", nextState: "q5_0" },
    
    { currentState: "q5_0", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q5_0" },
    { currentState: "q5_0", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q5_0" },
    { currentState: "q5_0", readSymbol: "X", writeSymbol: "0", move: "R", nextState: "q1" },
    
    { currentState: "q4_1", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "q4_1" },
    { currentState: "q4_1", readSymbol: "+", writeSymbol: "+", move: "R", nextState: "q5_1" },
    
    { currentState: "q5_1", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q5_1" },
    { currentState: "q5_1", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q5_1" },
    { currentState: "q5_1", readSymbol: "X", writeSymbol: "1", move: "R", nextState: "q1" },
    
    // Con acarreo (1+1=10)
    { currentState: "q4_c", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "q4_c" },
    { currentState: "q4_c", readSymbol: "+", writeSymbol: "+", move: "R", nextState: "q5_c" },
    
    { currentState: "q5_c", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q5_c" },
    { currentState: "q5_c", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q5_c" },
    { currentState: "q5_c", readSymbol: "X", writeSymbol: "0", move: "R", nextState: "q1c" },
    
    // Propaga acarreo
    { currentState: "q1c", readSymbol: "0", writeSymbol: "X", move: "L", nextState: "qc2_0" },
    { currentState: "q1c", readSymbol: "1", writeSymbol: "X", move: "L", nextState: "qc2_1" },
    { currentState: "q1c", readSymbol: "+", writeSymbol: "_", move: "L", nextState: "q6c" },
    
    { currentState: "qc2_0", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "qc2_0" },
    { currentState: "qc2_0", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "qc2_0" },
    { currentState: "qc2_0", readSymbol: "+", writeSymbol: "+", move: "L", nextState: "qc3_0" },
    
    { currentState: "qc3_0", readSymbol: "0", writeSymbol: "Y", move: "R", nextState: "q4_1" },
    { currentState: "qc3_0", readSymbol: "1", writeSymbol: "Y", move: "R", nextState: "q4_c" },
    { currentState: "qc3_0", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "qc3_0" },
    
    { currentState: "qc2_1", readSymbol: "0", writeSymbol: "0", move: "L", nextState: "qc2_1" },
    { currentState: "qc2_1", readSymbol: "1", writeSymbol: "1", move: "L", nextState: "qc2_1" },
    { currentState: "qc2_1", readSymbol: "+", writeSymbol: "+", move: "L", nextState: "qc3_1" },
    
    { currentState: "qc3_1", readSymbol: "0", writeSymbol: "Y", move: "R", nextState: "q4_c" },
    { currentState: "qc3_1", readSymbol: "1", writeSymbol: "Y", move: "R", nextState: "qc4_c" },
    { currentState: "qc3_1", readSymbol: "Y", writeSymbol: "Y", move: "L", nextState: "qc3_1" },
    
    { currentState: "qc4_c", readSymbol: "Y", writeSymbol: "Y", move: "R", nextState: "qc4_c" },
    { currentState: "qc4_c", readSymbol: "+", writeSymbol: "+", move: "R", nextState: "qc5" },
    
    { currentState: "qc5", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "qc5" },
    { currentState: "qc5", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "qc5" },
    { currentState: "qc5", readSymbol: "X", writeSymbol: "1", move: "R", nextState: "q1c" },
    
    // Limpieza final
    { currentState: "q6", readSymbol: "Y", writeSymbol: "_", move: "L", nextState: "q6" },
    { currentState: "q6", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "q7" },
    
    { currentState: "q6c", readSymbol: "Y", writeSymbol: "_", move: "L", nextState: "q6c" },
    { currentState: "q6c", readSymbol: "_", writeSymbol: "1", move: "R", nextState: "q7" },
    
    { currentState: "q7", readSymbol: "_", writeSymbol: "_", move: "R", nextState: "q7" },
    { currentState: "q7", readSymbol: "0", writeSymbol: "0", move: "R", nextState: "q7" },
    { currentState: "q7", readSymbol: "1", writeSymbol: "1", move: "R", nextState: "q7" },
    { currentState: "q7", readSymbol: "X", writeSymbol: "_", move: "R", nextState: "q7" },
    { currentState: "q7", readSymbol: "+", writeSymbol: "_", move: "R", nextState: "q7" },
  ],
};
