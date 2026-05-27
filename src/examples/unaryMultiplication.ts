import { TMConfig } from "../types";

export const unaryMultiplication: TMConfig = {
  title: "Multiplicación Unaria",
  description:
    "Multiplica dos números en notación unaria separados por '*'. Ejemplo: '111*11' (3×2) produce '111111' (6). Copia el primer número tantas veces como indique el segundo.",
  tape: ["1", "1", "1", "*", "1", "1"],
  initialState: "q0",
  blankSymbol: "_",
  transitions: [
    // Marca un 1 del multiplicando
    {
      currentState: "q0",
      readSymbol: "1",
      writeSymbol: "X",
      move: "R",
      nextState: "q1",
    },
    {
      currentState: "q0",
      readSymbol: "*",
      writeSymbol: "*",
      move: "R",
      nextState: "qclean",
    },

    // Salta hasta el multiplicador
    {
      currentState: "q1",
      readSymbol: "1",
      writeSymbol: "1",
      move: "R",
      nextState: "q1",
    },
    {
      currentState: "q1",
      readSymbol: "*",
      writeSymbol: "*",
      move: "R",
      nextState: "q2",
    },

    // Marca un 1 del multiplicador
    {
      currentState: "q2",
      readSymbol: "1",
      writeSymbol: "Y",
      move: "R",
      nextState: "q3",
    },
    {
      currentState: "q2",
      readSymbol: "Y",
      writeSymbol: "Y",
      move: "R",
      nextState: "q2",
    },
    {
      currentState: "q2",
      readSymbol: "=",
      writeSymbol: "=",
      move: "L",
      nextState: "q6",
    },
    {
      currentState: "q2",
      readSymbol: "_",
      writeSymbol: "=",
      move: "R",
      nextState: "q4",
    },

    // Escribe un 1 en el resultado
    {
      currentState: "q3",
      readSymbol: "1",
      writeSymbol: "1",
      move: "R",
      nextState: "q3",
    },
    {
      currentState: "q3",
      readSymbol: "Y",
      writeSymbol: "Y",
      move: "R",
      nextState: "q3",
    },
    {
      currentState: "q3",
      readSymbol: "=",
      writeSymbol: "=",
      move: "R",
      nextState: "q3",
    },
    {
      currentState: "q3",
      readSymbol: "Z",
      writeSymbol: "Z",
      move: "R",
      nextState: "q3",
    },
    {
      currentState: "q3",
      readSymbol: "_",
      writeSymbol: "Z",
      move: "L",
      nextState: "q4",
    },

    // Regresa al multiplicador
    {
      currentState: "q4",
      readSymbol: "Z",
      writeSymbol: "Z",
      move: "L",
      nextState: "q4",
    },
    {
      currentState: "q4",
      readSymbol: "=",
      writeSymbol: "=",
      move: "L",
      nextState: "q4",
    },
    {
      currentState: "q4",
      readSymbol: "Y",
      writeSymbol: "Y",
      move: "L",
      nextState: "q4",
    },
    {
      currentState: "q4",
      readSymbol: "1",
      writeSymbol: "1",
      move: "L",
      nextState: "q4",
    },
    {
      currentState: "q4",
      readSymbol: "*",
      writeSymbol: "*",
      move: "L",
      nextState: "q4",
    },
    {
      currentState: "q4",
      readSymbol: "X",
      writeSymbol: "X",
      move: "R",
      nextState: "q5",
    },
    {
      currentState: "q4",
      readSymbol: "1",
      writeSymbol: "1",
      move: "R",
      nextState: "q2",
    },

    // Salta al multiplicador para siguiente iteración
    {
      currentState: "q5",
      readSymbol: "1",
      writeSymbol: "1",
      move: "R",
      nextState: "q5",
    },
    {
      currentState: "q5",
      readSymbol: "*",
      writeSymbol: "*",
      move: "R",
      nextState: "q2",
    },

    // Restaura el multiplicador
    {
      currentState: "q6",
      readSymbol: "Y",
      writeSymbol: "1",
      move: "L",
      nextState: "q6",
    },
    {
      currentState: "q6",
      readSymbol: "1",
      writeSymbol: "1",
      move: "L",
      nextState: "q6",
    },
    {
      currentState: "q6",
      readSymbol: "*",
      writeSymbol: "*",
      move: "L",
      nextState: "q6",
    },
    {
      currentState: "q6",
      readSymbol: "X",
      writeSymbol: "X",
      move: "R",
      nextState: "q0",
    },
    {
      currentState: "q6",
      readSymbol: "1",
      writeSymbol: "1",
      move: "L",
      nextState: "q6",
    },

    // Limpieza: borra el multiplicando y multiplicador
    {
      currentState: "qclean",
      readSymbol: "1",
      writeSymbol: "_",
      move: "R",
      nextState: "qclean",
    },
    {
      currentState: "qclean",
      readSymbol: "Y",
      writeSymbol: "_",
      move: "R",
      nextState: "qclean",
    },
    {
      currentState: "qclean",
      readSymbol: "=",
      writeSymbol: "_",
      move: "R",
      nextState: "qresult",
    },

    // Convierte Z en 1 para el resultado final
    {
      currentState: "qresult",
      readSymbol: "Z",
      writeSymbol: "1",
      move: "R",
      nextState: "qresult",
    },
    {
      currentState: "qresult",
      readSymbol: "_",
      writeSymbol: "_",
      move: "N",
      nextState: "accept",
    },
  ],
};
