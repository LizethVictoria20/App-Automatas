import { TMConfig } from "../types";

// Generamos transiciones para todas las letras minúsculas
const generatePalindromeTransitions = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const transitions: TMConfig["transitions"] = [];

  // Estado inicial: marcar el primer símbolo y buscar el último
  letters.forEach((letter, idx) => {
    // q0: Lee una letra, la marca con X, y va al estado específico para esa letra
    transitions.push({
      currentState: "q0",
      readSymbol: letter,
      writeSymbol: "X",
      move: "R",
      nextState: `q_search_${letter}`,
    });
  });

  // Si encuentra espacio en blanco al inicio, acepta (cadena vacía o ya procesada)
  transitions.push({
    currentState: "q0",
    readSymbol: "_",
    writeSymbol: "_",
    move: "N",
    nextState: "accept",
  });

  // Si encuentra X al inicio, significa que ya procesó todo
  transitions.push({
    currentState: "q0",
    readSymbol: "X",
    writeSymbol: "X",
    move: "R",
    nextState: "q_skip",
  });

  // Estado para saltar las X's
  letters.forEach((letter) => {
    transitions.push({
      currentState: "q_skip",
      readSymbol: letter,
      writeSymbol: letter,
      move: "R",
      nextState: "q_skip",
    });
  });

  transitions.push({
    currentState: "q_skip",
    readSymbol: "X",
    writeSymbol: "X",
    move: "R",
    nextState: "q_skip",
  });

  transitions.push({
    currentState: "q_skip",
    readSymbol: "_",
    writeSymbol: "_",
    move: "N",
    nextState: "accept",
  });

  // Para cada letra, crear estados de búsqueda del final
  letters.forEach((letter) => {
    const searchState = `q_search_${letter}`;
    const returnState = `q_return_${letter}`;

    // Mientras busca el final, avanza sobre cualquier letra o X
    letters.forEach((otherLetter) => {
      transitions.push({
        currentState: searchState,
        readSymbol: otherLetter,
        writeSymbol: otherLetter,
        move: "R",
        nextState: searchState,
      });
    });

    transitions.push({
      currentState: searchState,
      readSymbol: "X",
      writeSymbol: "X",
      move: "R",
      nextState: searchState,
    });

    // Cuando llega al final (espacio), retrocede
    transitions.push({
      currentState: searchState,
      readSymbol: "_",
      writeSymbol: "_",
      move: "L",
      nextState: returnState,
    });

    // En el estado de retorno, verifica que el último símbolo sea la letra correcta
    transitions.push({
      currentState: returnState,
      readSymbol: letter,
      writeSymbol: "X",
      move: "L",
      nextState: "q_back",
    });

    // Si el último símbolo no coincide, rechaza
    letters.forEach((otherLetter) => {
      if (otherLetter !== letter) {
        transitions.push({
          currentState: returnState,
          readSymbol: otherLetter,
          writeSymbol: otherLetter,
          move: "N",
          nextState: "reject",
        });
      }
    });

    // Si encuentra X (ya fue marcado), también rechaza
    transitions.push({
      currentState: returnState,
      readSymbol: "X",
      writeSymbol: "X",
      move: "N",
      nextState: "reject",
    });
  });

  // Estado para regresar al inicio
  transitions.push({
    currentState: "q_back",
    readSymbol: "X",
    writeSymbol: "X",
    move: "L",
    nextState: "q_back",
  });

  letters.forEach((letter) => {
    transitions.push({
      currentState: "q_back",
      readSymbol: letter,
      writeSymbol: letter,
      move: "L",
      nextState: "q_back",
    });
  });

  transitions.push({
    currentState: "q_back",
    readSymbol: "_",
    writeSymbol: "_",
    move: "R",
    nextState: "q0",
  });

  return transitions;
};

export const palindromeGeneral: TMConfig = {
  title: "Palíndromo General (Alfabeto Completo)",
  description:
    "Verifica si una palabra se lee igual de izquierda a derecha que de derecha a izquierda. Acepta cualquier letra del alfabeto (a-z). Ejemplos: 'reconocer', 'anilina', 'oso', 'radar'.",
  tape: ["r", "e", "c", "o", "n", "o", "c", "e", "r"],
  initialState: "q0",
  blankSymbol: "_",
  transitions: generatePalindromeTransitions(),
};
