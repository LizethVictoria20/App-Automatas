/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Settings,
  Save,
  Download,
  Cpu,
  BookOpen,
  Plus,
  Trash2,
  Share2,
  ChevronRight,
  Info,
  Sparkles,
  Network,
  ArrowLeft,
  ArrowRight,
  Minus,
} from "lucide-react";
import { TMConfig, TMState, Transition, Symbol } from "./types";
import { EXAMPLES } from "./examples";
import { cn } from "./lib/utils";
import confetti from "canvas-confetti";
import Markdown from "react-markdown";
import StateGraph from "./components/StateGraph";

// --- Components ---

const Header = () => (
  <header className="sticky top-0 z-40 border-b border-black/10 bg-white/75 backdrop-blur">
    <div className="px-6 sm:px-8 py-5 flex justify-between items-center">
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-linear-to-br from-black/10 via-black/5 to-transparent blur"></div>
          <div className="relative w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
            <Cpu size={22} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-semibold tracking-tight text-lg sm:text-xl truncate">
              Máquina de Turing
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border border-black/10 bg-white">
              Simulador
            </span>
          </div>
          <p className="text-[11px] text-black/50 leading-snug">
            Autómatas • Cinta • Transiciones • Ejercicios
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="w-9 h-9 rounded-full border-2 border-white bg-linear-to-br from-blue-200 to-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-900 shadow-sm">
            LV
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-white bg-linear-to-br from-emerald-200 to-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-900 shadow-sm">
            MM
          </div>
        </div>
      </div>
    </div>
  </header>
);

const TapeComponent = ({
  state,
  blankSymbol,
  lastMove,
}: {
  state: TMState;
  blankSymbol: Symbol;
  lastMove: "L" | "R" | "N" | null;
}) => {
  const visibleRange = 10;
  const cells = [];

  for (
    let i = state.headIndex - visibleRange;
    i <= state.headIndex + visibleRange;
    i++
  ) {
    cells.push({
      index: i,
      value: state.tape[i] || blankSymbol,
    });
  }

  const getMoveText = () => {
    if (!lastMove || state.stepCount === 0) return null;
    switch (lastMove) {
      case "L":
        return {
          text: "IZQUIERDA",
          icon: ArrowLeft,
          color: "text-blue-700",
          bg: "bg-blue-50",
          border: "border-blue-300",
          shadowColor: "shadow-blue-200/50",
        };
      case "R":
        return {
          text: "DERECHA",
          icon: ArrowRight,
          color: "text-green-700",
          bg: "bg-green-50",
          border: "border-green-300",
          shadowColor: "shadow-green-200/50",
        };
      case "N":
        return {
          text: "SIN MOVIMIENTO",
          icon: Minus,
          color: "text-gray-700",
          bg: "bg-gray-50",
          border: "border-gray-300",
          shadowColor: "shadow-gray-200/50",
        };
      default:
        return null;
    }
  };

  const moveInfo = getMoveText();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Movement Direction Indicator */}
      {moveInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
          className={cn(
            "mb-4 mt-2 px-4 py-2 rounded-lg border-2 shadow-lg font-bold text-xs tracking-wider flex items-center gap-2",
            moveInfo.bg,
            moveInfo.border,
            moveInfo.color,
            moveInfo.shadowColor,
          )}
          style={{ position: "static" }}
        >
          <moveInfo.icon size={16} strokeWidth={3} />
          <span>{moveInfo.text}</span>
          <moveInfo.icon size={16} strokeWidth={3} />
        </motion.div>
      )}
      <div className="relative w-full overflow-hidden py-12 bg-[#F8F8F7] border-y border-black/5">
        <div className="absolute top-0 left-1/2 -ml-px w-px h-full bg-black/10 z-0"></div>
        <div className="flex justify-center items-center gap-2">
          <AnimatePresence initial={false}>
            {cells.map((cell) => (
              <motion.div
                key={cell.index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: cell.index === state.headIndex ? 1.1 : 1,
                  x: (cell.index - state.headIndex) * 64,
                  zIndex: cell.index === state.headIndex ? 20 : 10,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className={cn(
                  "absolute w-14 h-14 flex items-center justify-center border font-mono text-lg transition-colors",
                  cell.index === state.headIndex
                    ? "bg-black text-white border-black shadow-xl"
                    : "bg-white text-black border-black/10",
                )}
              >
                {cell.value}
                {cell.index === state.headIndex && (
                  <div className="absolute -top-8 text-[10px] font-bold text-black uppercase tracking-tighter">
                    Cabezal
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* Pointer UI */}
      <div className="absolute bottom-4 left-1/2 -ml-3 z-30">
        <div className="w-0 h-0 bg-white  border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-10 border-b-pink"></div>
      </div>
    </div>
  );
};

// Helper functions for example-specific guidance
const getPlaceholderForExample = (exampleId: string): string => {
  const placeholders: Record<string, string> = {
    repeat01: "01",
    binaryIncrement: "1011",
    divisibleBy3Binary: "110",
    copyOnes: "1101",
    divisibleBy3Base10: "123",
    threeEqualLength: "aabbcc",
    equalStrings: "abc#abc",
    palindrome: "abba",
    palindromeGeneral: "reconocer",
    busyBeaver3: "_",
    busyBeaver4: "_",
    powersOfTwo: "11111111",
    multipliedLengths: "bbcccaaaaaa",
    binaryAddition: "101+11",
    unaryAddition: "111+11",
    unaryMultiplication: "111*11",
    binaryMultiplication: "11*10",
  };
  return placeholders[exampleId] || "Escribe tu entrada aquí";
};

const getHelpTextForExample = (exampleId: string): string => {
  const helpTexts: Record<string, string> = {
    repeat01: "Escribe un patrón para duplicar (ej: '01', '10', '001')",
    binaryIncrement: "Escribe un número binario (ej: '1011', '11111', '100')",
    divisibleBy3Binary:
      "Escribe un número binario para verificar si es divisible por 3",
    copyOnes: "Escribe una secuencia con 0s y 1s (ej: '1101', '0110')",
    divisibleBy3Base10: "Escribe un número decimal (ej: '123', '456', '999')",
    threeEqualLength:
      "Escribe igual cantidad de 'a', 'b' y 'c' (ej: 'aabbcc', 'aaabbbccc')",
    equalStrings:
      "Escribe dos cadenas iguales separadas por '#' (ej: 'abc#abc', 'hola#hola')",
    palindrome:
      "⚠️ Solo acepta símbolos 'a' y 'b' (ej: 'abba', 'aba', 'bab', 'aa')",
    palindromeGeneral:
      "✨ Acepta cualquier palabra con letras a-z (ej: 'reconocer', 'anilina', 'oso', 'radar', 'neuquen')",
    busyBeaver3: "Deja la cinta vacía (_) para ver el Busy Beaver en acción",
    busyBeaver4: "Deja la cinta vacía (_) para ver el Busy Beaver en acción",
    powersOfTwo:
      "Escribe una secuencia de 1s (ej: '11111111' para 8, '1111' para 4)",
    multipliedLengths:
      "Formato: 'm' b's + 'n' c's + 'm×n' a's (ej: 'bbcccaaaaaa' = 2×3=6)",
    binaryAddition: "Formato: número1+número2 (ej: '101+11', '1010+101')",
    unaryAddition: "Formato: 1s+1s (ej: '111+11' = 3+2, '1111+111' = 4+3)",
    unaryMultiplication:
      "Formato: 1s*1s (ej: '111*11' = 3×2, '1111*111' = 4×3)",
    binaryMultiplication:
      "Formato: binario*binario (ej: '11*10' = 3×2, '101*11' = 5×3)",
  };
  return helpTexts[exampleId] || "Escribe la entrada que deseas probar";
};

const getValidSymbols = (exampleId: string): string[] => {
  const validSymbols: Record<string, string[]> = {
    binaryIncrement: ["0", "1"],
    palindrome: ["a", "b"],
    palindromeGeneral: "abcdefghijklmnopqrstuvwxyz".split(""),
    copyOnes: ["0", "1"],
    repeat01: ["0", "1"],
    divisibleBy3Binary: ["0", "1"],
    divisibleBy3Base10: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    threeEqualLength: ["a", "b", "c"],
    equalStrings: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "#",
    ],
    busyBeaver3: ["_", " "],
    busyBeaver4: ["_", " "],
    powersOfTwo: ["1"],
    multipliedLengths: ["a", "b", "c"],
    binaryAddition: ["0", "1", "+"],
    unaryAddition: ["1", "+"],
    unaryMultiplication: ["1", "*"],
    binaryMultiplication: ["0", "1", "*"],
  };
  return validSymbols[exampleId] || [];
};

const validateInput = (
  input: string,
  exampleId: string,
): { valid: boolean; message?: string; warning?: string } => {
  if (!exampleId) return { valid: true };

  const validSymbols = getValidSymbols(exampleId);
  if (validSymbols.length === 0) return { valid: true };

  const invalidChars = input
    .split("")
    .filter((char) => !validSymbols.includes(char));

  if (invalidChars.length > 0) {
    const uniqueInvalid = [...new Set(invalidChars)].join(", ");
    return {
      valid: true, // ¡Permitir cualquier entrada!
      warning: `⚠️ Nota: La entrada contiene símbolos "${uniqueInvalid}" que podrían no tener transiciones definidas. Este ejercicio fue diseñado para: ${validSymbols.join(", ")}`,
    };
  }

  return { valid: true };
};

const getQuickExamples = (exampleId: string): string[] => {
  const examples: Record<string, string[]> = {
    repeat01: ["01", "10", "001", "11"],
    binaryIncrement: ["1011", "1111", "100", "1", "10101"],
    divisibleBy3Binary: ["11", "110", "1001", "1100"],
    copyOnes: ["1101", "0110", "1111", "10101"],
    divisibleBy3Base10: ["123", "456", "789", "999", "12"],
    threeEqualLength: ["abc", "aabbcc", "aaabbbccc"],
    equalStrings: ["abc#abc", "hola#hola", "test#test", "123#123"],
    palindrome: ["abba", "aba", "bab", "aa", "bb", "a"],
    palindromeGeneral: [
      "reconocer",
      "anilina",
      "oso",
      "radar",
      "neuquen",
      "sometemos",
    ],
    busyBeaver3: ["_"],
    busyBeaver4: ["_"],
    powersOfTwo: ["11", "1111", "11111111", "1111111111111111"],
    multipliedLengths: ["bca", "bbccaaaa", "bbcccaaaaaa"],
    binaryAddition: ["101+11", "1010+101", "1111+1", "10+10"],
    unaryAddition: ["111+11", "1111+111", "11+11", "1+1"],
    unaryMultiplication: ["111*11", "1111*111", "11*11", "111*1"],
    binaryMultiplication: ["11*10", "101*11", "10*10", "111*10"],
  };
  return examples[exampleId] || [];
};

// Función para generar transiciones dinámicas de palíndromo basadas en los símbolos de entrada
const generateDynamicPalindromeTransitions = (
  inputSymbols: string[],
): TMConfig["transitions"] => {
  // Obtener símbolos únicos de la entrada
  const uniqueSymbols = [...new Set(inputSymbols.filter((s) => s !== "_"))];

  if (uniqueSymbols.length === 0) {
    return [
      {
        currentState: "q0",
        readSymbol: "_",
        writeSymbol: "_",
        move: "N",
        nextState: "accept",
      },
    ];
  }

  const transitions: TMConfig["transitions"] = [];

  // Estado inicial: marcar el primer símbolo
  uniqueSymbols.forEach((symbol) => {
    transitions.push({
      currentState: "q0",
      readSymbol: symbol,
      writeSymbol: "X",
      move: "R",
      nextState: `q_search_${symbol}`,
    });
  });

  // Si encuentra blanco al inicio, acepta (cadena vacía o ya procesada)
  transitions.push({
    currentState: "q0",
    readSymbol: "_",
    writeSymbol: "_",
    move: "N",
    nextState: "accept",
  });

  // Si encuentra X al inicio, salta
  transitions.push({
    currentState: "q0",
    readSymbol: "X",
    writeSymbol: "X",
    move: "R",
    nextState: "q_skip",
  });

  // Estado para saltar las X's
  uniqueSymbols.forEach((symbol) => {
    transitions.push({
      currentState: "q_skip",
      readSymbol: symbol,
      writeSymbol: symbol,
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

  // Para cada símbolo, crear estados de búsqueda
  uniqueSymbols.forEach((symbol) => {
    const searchState = `q_search_${symbol}`;
    const returnState = `q_return_${symbol}`;

    // Avanzar sobre cualquier símbolo mientras busca el final
    uniqueSymbols.forEach((otherSymbol) => {
      transitions.push({
        currentState: searchState,
        readSymbol: otherSymbol,
        writeSymbol: otherSymbol,
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

    // Cuando llega al final, retrocede
    transitions.push({
      currentState: searchState,
      readSymbol: "_",
      writeSymbol: "_",
      move: "L",
      nextState: returnState,
    });

    // Verifica que el último símbolo coincida
    transitions.push({
      currentState: returnState,
      readSymbol: symbol,
      writeSymbol: "X",
      move: "L",
      nextState: "q_back",
    });

    // Si no coincide, rechaza
    uniqueSymbols.forEach((otherSymbol) => {
      if (otherSymbol !== symbol) {
        transitions.push({
          currentState: returnState,
          readSymbol: otherSymbol,
          writeSymbol: otherSymbol,
          move: "N",
          nextState: "reject",
        });
      }
    });

    // Si encuentra X ya marcado, rechaza
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

  uniqueSymbols.forEach((symbol) => {
    transitions.push({
      currentState: "q_back",
      readSymbol: symbol,
      writeSymbol: symbol,
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

export default function App() {
  const [config, setConfig] = useState<TMConfig>(EXAMPLES.binaryIncrement);
  const [state, setState] = useState<TMState>({
    tape: [...EXAMPLES.binaryIncrement.tape],
    headIndex: 0,
    currentState: EXAMPLES.binaryIncrement.initialState,
    isRunning: false,
    stepCount: 0,
    isHalted: false,
  });

  const [speed, setSpeed] = useState(500); // ms
  const [explanation, setExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeTab, setActiveTab] = useState<"rules" | "config">("rules");
  const [selectedExampleId, setSelectedExampleId] = useState<string>("");
  const [dynamicMode, setDynamicMode] = useState(false); // Modo de transiciones dinámicas
  const [lastMove, setLastMove] = useState<"L" | "R" | "N" | null>(null); // Última dirección de movimiento

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Efecto para actualizar transiciones dinámicamente cuando cambia la entrada
  useEffect(() => {
    if (dynamicMode && !state.isRunning && state.stepCount === 0) {
      const newTransitions = generateDynamicPalindromeTransitions(config.tape);
      setConfig((prev) => ({
        ...prev,
        transitions: newTransitions,
      }));
    }
  }, [config.tape, dynamicMode, state.isRunning, state.stepCount]);

  // Auto-apply config changes to state when config changes
  useEffect(() => {
    // Only reset if machine is not running and hasn't made progress
    if (!state.isRunning && state.stepCount === 0) {
      setState({
        tape: [...config.tape],
        headIndex: 0,
        currentState: config.initialState,
        isRunning: false,
        stepCount: 0,
        isHalted: false,
      });
      setExplanation("");
    }
  }, [config.tape, config.initialState, state.isRunning, state.stepCount]);

  const reset = useCallback(() => {
    setState({
      tape: [...config.tape],
      headIndex: 0,
      currentState: config.initialState,
      isRunning: false,
      stepCount: 0,
      isHalted: false,
    });
    setExplanation("");
    setLastMove(null); // Limpiar el indicador de dirección
  }, [config]);

  const exportLog = () => {
    const log = `Turing Machine Log\nSteps: ${state.stepCount}\nFinal State: ${state.currentState}\nTape: ${state.tape.join("")}`;
    const blob = new Blob([log], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tm-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const step = useCallback(async () => {
    if (state.isHalted) return;

    const currentSymbol = state.tape[state.headIndex] || config.blankSymbol;
    const rule = config.transitions.find(
      (t) =>
        t.currentState === state.currentState && t.readSymbol === currentSymbol,
    );

    if (!rule) {
      const finalState = state.currentState;
      setState((prev) => ({ ...prev, isHalted: true, isRunning: false }));

      // Get AI to explain the halt reason
      getExplanation(
        finalState,
        state.tape,
        state.headIndex,
        {
          currentState: finalState,
          readSymbol: currentSymbol,
          writeSymbol: currentSymbol,
          move: "N",
          nextState: finalState,
        },
        finalState,
        true,
      );

      if (finalState === "accept") {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      return;
    }

    const newTape = [...state.tape];
    newTape[state.headIndex] = rule.writeSymbol;

    let newHeadIndex = state.headIndex;
    if (rule.move === "L") newHeadIndex--;
    if (rule.move === "R") newHeadIndex++;

    // Ensure state.tape has enough breadth
    if (newHeadIndex < 0) {
      newTape.unshift(config.blankSymbol);
      newHeadIndex = 0;
    } else if (newHeadIndex >= newTape.length) {
      newTape.push(config.blankSymbol);
    }

    const nextStateData: TMState = {
      tape: newTape,
      headIndex: newHeadIndex,
      currentState: rule.nextState,
      isRunning: state.isRunning,
      stepCount: state.stepCount + 1,
      isHalted:
        rule.nextState === "halt" ||
        rule.nextState === "accept" ||
        rule.nextState === "reject",
    };

    setState(nextStateData);
    setLastMove(rule.move); // Guardar la dirección del último movimiento

    if (nextStateData.isHalted) {
      if (nextStateData.currentState === "accept") {
        confetti({ particleCount: 150, spread: 100 });
      }
      getExplanation(
        state.currentState,
        state.tape,
        state.headIndex,
        rule,
        nextStateData.currentState,
        true,
      );
    } else if (selectedExampleId || Math.random() > 0.8) {
      getExplanation(
        state.currentState,
        state.tape,
        state.headIndex,
        rule,
        nextStateData.currentState,
      );
    }
  }, [state, config, selectedExampleId]);

  const getExplanation = async (
    currState: string,
    tape: Symbol[],
    head: number,
    rule: Transition,
    nextState: string,
    isHalt: boolean = false,
  ) => {
    try {
      setIsExplaining(true);
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: currState,
          tape,
          headIndex: head,
          currentRule: rule,
          nextAction: isHalt
            ? `HALT en estado ${nextState}. No hay más movimientos posibles o se llegó a un estado final.`
            : `Lee ${tape[head]}, escribe ${rule.writeSymbol}, mueve ${rule.move}, siguiente estado ${nextState}`,
        }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  useEffect(() => {
    if (state.isRunning && !state.isHalted) {
      timerRef.current = setInterval(step, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, state.isHalted, step, speed]);

  const toggleRun = () =>
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));

  const updateTransition = (
    index: number,
    field: keyof Transition,
    value: string,
  ) => {
    const newTransitions = [...config.transitions];
    newTransitions[index] = { ...newTransitions[index], [field]: value };
    setConfig((prev) => ({ ...prev, transitions: newTransitions }));
  };

  const addTransition = () => {
    setConfig((prev) => ({
      ...prev,
      transitions: [
        ...prev.transitions,
        {
          currentState: "q0",
          readSymbol: "0",
          writeSymbol: "1",
          move: "R",
          nextState: "q0",
        },
      ],
    }));
  };

  const removeTransition = (index: number) => {
    const newTransitions = config.transitions.filter((_, i) => i !== index);
    setConfig((prev) => ({ ...prev, transitions: newTransitions }));
  };

  return (
    <div className="min-h-screen bg-[#EBEAE6] text-black font-sans selection:bg-black selection:text-white">
      <Header />

      <main className="max-w-450 mx-auto p-8 flex flex-col gap-8">
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Machine Header */}
          <section className="bg-white p-6 rounded-xl border border-black/5 shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                <h2 className="text-sm font-medium uppercase tracking-wider text-black/40">
                  Máquina Activa
                </h2>
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    state.currentState === "accept" && "text-green-600",
                    state.currentState === "reject" && "text-red-600",
                    state.isHalted &&
                      state.stepCount === 0 &&
                      "text-orange-600",
                  )}
                >
                  {state.isHalted
                    ? state.currentState === "accept"
                      ? "Cadena Aceptada ✓"
                      : state.currentState === "reject"
                        ? "Cadena Rechazada ✗"
                        : state.stepCount === 0
                          ? "Sin regla para comenzar - Verifica tu configuración"
                          : "Simulación Finalizada"
                    : "Ejecución del Simulador"}
                </p>
              </div>

              {/* Exercise Selector Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-black/40 tracking-wider">
                  Seleccionar Ejercicio
                </label>
                <select
                  value={selectedExampleId || ""}
                  onChange={(e) => {
                    const exampleId = e.target.value;
                    if (exampleId && EXAMPLES[exampleId]) {
                      setSelectedExampleId(exampleId);
                      const example = EXAMPLES[exampleId];
                      setConfig(example);
                      setDynamicMode(exampleId === "palindromeGeneral");
                    } else {
                      setSelectedExampleId(null);
                    }
                  }}
                  className="min-w-70 px-4 py-2.5 bg-white border-2 border-black/10 rounded-lg font-medium text-sm hover:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all cursor-pointer"
                >
                  <option value="">-- Ejercicios Disponibles --</option>
                  <optgroup label="🎯 Básicos">
                    <option value="repeat01">Repetir 01</option>
                    <option value="copyOnes">Copiar 1s</option>
                    <option value="unaryAddition">Suma Unaria</option>
                  </optgroup>
                  <optgroup label="🔢 Números Binarios">
                    <option value="binaryIncrement">Incremento Binario</option>
                    <option value="divisibleBy3Binary">
                      Divisible por 3 (binario)
                    </option>
                    <option value="binaryAddition">Suma Binaria</option>
                    <option value="binaryMultiplication">
                      Multiplicación Binaria
                    </option>
                  </optgroup>
                  <optgroup label="🔤 Cadenas y Palíndromos">
                    <option value="palindrome">Palíndromo (a,b)</option>
                    <option value="palindromeGeneral">
                      ✨ Palíndromo General (a-z)
                    </option>
                    <option value="equalStrings">Cadenas Iguales</option>
                  </optgroup>
                  <optgroup label="🧮 Matemáticas Avanzadas">
                    <option value="divisibleBy3Base10">
                      Divisible por 3 (base 10)
                    </option>
                    <option value="threeEqualLength">
                      Tres cadenas (aⁿbⁿcⁿ)
                    </option>
                    <option value="powersOfTwo">Potencias de 2</option>
                    <option value="multipliedLengths">
                      Longitudes Multiplicadas
                    </option>
                    <option value="unaryMultiplication">
                      Multiplicación Unaria
                    </option>
                  </optgroup>
                  <optgroup label="🏆 Busy Beavers">
                    <option value="busyBeaver3">Busy Beaver 3 Estados</option>
                    <option value="busyBeaver4">Busy Beaver 4 Estados</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-black/40 uppercase">
                    Estado
                  </span>
                  <span className="font-mono font-medium px-3 py-1 bg-black text-white rounded-sm">
                    {state.currentState}
                  </span>
                </div>
                <div className="flex flex-col items-end border-l border-black/10 pl-4 ml-2">
                  <span className="text-[10px] font-mono text-black/40 uppercase">
                    Pasos
                  </span>
                  <span className="font-mono font-medium">
                    {state.stepCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Exercise Info */}
            {selectedExampleId && EXAMPLES[selectedExampleId]?.description && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                <BookOpen size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    {EXAMPLES[selectedExampleId].title || selectedExampleId}
                  </p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {EXAMPLES[selectedExampleId].description}
                  </p>
                </div>
              </div>
            )}

            {state.isHalted && state.stepCount === 0 && (
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
                <Info size={18} className="text-orange-600 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-900">
                    No se encontró ninguna regla de transición
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    La máquina no tiene una regla definida para el estado{" "}
                    <strong>"{state.currentState}"</strong> leyendo el símbolo{" "}
                    <strong>
                      "{state.tape[state.headIndex] || config.blankSymbol}"
                    </strong>
                    .
                  </p>
                  {selectedExampleId &&
                    (() => {
                      const validation = validateInput(
                        config.tape.join(""),
                        selectedExampleId,
                      );
                      if (validation.warning) {
                        return (
                          <div className="pt-2 mt-2 border-t border-orange-300">
                            <p className="text-xs text-orange-800 leading-relaxed">
                              <strong>💡 Nota:</strong> Este ejercicio fue
                              diseñado para símbolos específicos, pero puedes
                              experimentar con cualquier entrada. Simplemente no
                              hay una transición definida para este caso.
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  <p className="text-xs text-orange-600 leading-relaxed pt-1">
                    {selectedExampleId
                      ? "Puedes probar con otra entrada o agregar tus propias reglas en la pestaña Reglas."
                      : "Ve a la pestaña Reglas y agrega una transición apropiada."}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Two Column Layout: Left = Tape+Config, Right = State Graph */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Tape and Configuration */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Tape Visualization */}
              <section className="bg-white rounded-xl border border-black/5 shadow-md overflow-hidden relative">
                <TapeComponent
                  state={state}
                  blankSymbol={config.blankSymbol}
                  lastMove={lastMove}
                />

                {/* Controls Bar */}
                <div className="px-8 py-6 flex items-center justify-between bg-white border-t border-black/5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleRun}
                      disabled={state.isHalted}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        state.isRunning
                          ? "bg-slate-100 text-black hover:bg-slate-200"
                          : "bg-black text-white hover:scale-105 active:scale-95 disabled:bg-slate-200",
                      )}
                    >
                      {state.isRunning ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                    <button
                      onClick={step}
                      disabled={state.isRunning || state.isHalted}
                      className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
                    >
                      <SkipForward size={20} />
                    </button>
                    <button
                      onClick={reset}
                      className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-black/30 mb-1">
                        Velocidad
                      </span>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        className="w-32 accent-black"
                      />
                    </div>
                    <div className="text-xs font-mono w-12 text-right">
                      {speed}ms
                    </div>
                  </div>
                </div>
              </section>

              {/* Sidebar Area: Tabbed Configuration */}
              <section className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col h-125">
                <div className="flex border-b border-black/5">
                  {[
                    { id: "rules", label: "Reglas" },
                    { id: "config", label: "Configuración" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors",
                        activeTab === tab.id
                          ? "bg-black text-white"
                          : "hover:bg-black/5 text-black/40",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <datalist id="states-list">
                    {Array.from(
                      new Set([
                        ...config.transitions.map((t) => t.currentState),
                        ...config.transitions.map((t) => t.nextState),
                        "accept",
                        "reject",
                        "halt",
                        "q0",
                      ]),
                    ).map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>

                  {activeTab === "rules" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Tabla de Transiciones</h3>
                        <button
                          onClick={addTransition}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase py-2 px-4 border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
                        >
                          <Plus size={14} /> Añadir Regla
                        </button>
                      </div>
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-black/5 italic font-serif opacity-50">
                            <th className="pb-3 px-2 font-normal">Estado</th>
                            <th className="pb-3 px-2 font-normal">Lee</th>
                            <th className="pb-3 px-2 font-normal">Escribe</th>
                            <th className="pb-3 px-2 font-normal">Mueve</th>
                            <th className="pb-3 px-2 font-normal">Sig.</th>
                            <th className="pb-3 px-2 font-normal"></th>
                          </tr>
                        </thead>
                        <tbody className="font-mono">
                          {config.transitions.map((t, i) => (
                            <tr
                              key={i}
                              className="group border-b border-black/5 hover:bg-black/5 transition-colors"
                            >
                              <td className="py-2 px-1">
                                <input
                                  list="states-list"
                                  className="w-20 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-black font-bold text-blue-700"
                                  value={t.currentState}
                                  onChange={(e) =>
                                    updateTransition(
                                      i,
                                      "currentState",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input
                                  className="w-8 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-black text-center border-x border-black/5"
                                  value={t.readSymbol}
                                  onChange={(e) =>
                                    updateTransition(
                                      i,
                                      "readSymbol",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input
                                  className="w-8 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-black text-center border-x border-black/5"
                                  value={t.writeSymbol}
                                  onChange={(e) =>
                                    updateTransition(
                                      i,
                                      "writeSymbol",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="py-2 px-1">
                                <select
                                  className="bg-transparent outline-none cursor-pointer font-bold px-1"
                                  value={t.move}
                                  onChange={(e) =>
                                    updateTransition(
                                      i,
                                      "move",
                                      e.target.value as any,
                                    )
                                  }
                                >
                                  <option value="L">L</option>
                                  <option value="R">R</option>
                                  <option value="N">N</option>
                                </select>
                              </td>
                              <td className="py-2 px-1">
                                <input
                                  list="states-list"
                                  className="w-20 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-black font-medium text-slate-600"
                                  value={t.nextState}
                                  onChange={(e) =>
                                    updateTransition(
                                      i,
                                      "nextState",
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                              <td className="py-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => removeTransition(i)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "config" && (
                    <div className="space-y-6">
                      {selectedExampleId && (
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-start gap-2">
                            <BookOpen
                              size={16}
                              className="text-blue-600 mt-0.5 shrink-0"
                            />
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-blue-900">
                                Ejercicio activo:{" "}
                                {EXAMPLES[selectedExampleId]?.title}
                              </p>
                              <p className="text-[11px] text-blue-700 leading-relaxed">
                                <strong>✨ Entrada libre:</strong> Puedes
                                escribir cualquier cadena que desues
                                experimentar. Los cambios se aplican
                                automáticamente. Si usas símbolos no definidos
                                en las reglas, simplemente la máquina se
                                detendrá cuando los encuentre.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start gap-2">
                          <Sparkles
                            size={16}
                            className="text-green-600 mt-0.5 shrink-0"
                          />
                          <div className="space-y-1">
                            <p className="text-[11px] text-green-800 leading-relaxed">
                              Los cambios en la configuración se aplican{" "}
                              <strong>automáticamente</strong> cuando la máquina
                              está en estado inicial (sin pasos ejecutados).
                            </p>
                            <p className="text-[10px] text-green-700 leading-relaxed">
                              💡 <strong>Tip:</strong> Experimenta libremente
                              con cualquier entrada. El simulador te dirá si no
                              hay reglas definidas para ciertos símbolos.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Toggle de Modo Dinámico */}
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="flex items-start gap-3">
                          <Sparkles
                            size={16}
                            className="text-purple-600 mt-0.5 shrink-0"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-purple-900">
                                  🎨 Modo Transiciones Dinámicas
                                </p>
                                <p className="text-[10px] text-purple-700 leading-relaxed mt-1">
                                  Genera automáticamente las reglas de
                                  transición basadas en los símbolos de tu
                                  entrada. Perfecto para verificar palíndromos
                                  con cualquier palabra.
                                </p>
                              </div>
                              <button
                                onClick={() => setDynamicMode(!dynamicMode)}
                                className={cn(
                                  "relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                                  dynamicMode ? "bg-purple-600" : "bg-gray-300",
                                )}
                              >
                                <span
                                  className={cn(
                                    "absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200",
                                    dynamicMode
                                      ? "translate-x-7"
                                      : "translate-x-0",
                                  )}
                                />
                              </button>
                            </div>
                            {dynamicMode && (
                              <div className="p-2 bg-purple-100 rounded-lg border border-purple-300">
                                <p className="text-[10px] text-purple-800 leading-relaxed">
                                  ✅ <strong>Activo:</strong> Las transiciones
                                  se generarán automáticamente para verificar si
                                  tu entrada es un palíndromo. Cambia la cinta y
                                  las reglas se actualizarán.
                                  <br />
                                  <span className="text-[9px] text-purple-600">
                                    Transiciones actuales:{" "}
                                    <strong>{config.transitions.length}</strong>{" "}
                                    reglas generadas
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-40">
                          Contenido Inicial de la Cinta
                        </label>
                        <input
                          className="w-full p-4 bg-black/5 rounded-lg font-mono text-base outline-none focus:ring-2 focus:ring-black"
                          value={config.tape.join("")}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              tape: e.target.value.split(""),
                            }))
                          }
                          placeholder={getPlaceholderForExample(
                            selectedExampleId,
                          )}
                        />
                        {selectedExampleId &&
                          (() => {
                            const validation = validateInput(
                              config.tape.join(""),
                              selectedExampleId,
                            );
                            if (validation.warning) {
                              return (
                                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-2">
                                  <Info
                                    size={14}
                                    className="text-yellow-600 mt-0.5 shrink-0"
                                  />
                                  <p className="text-[10px] text-yellow-800 leading-relaxed">
                                    {validation.warning}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {getHelpTextForExample(selectedExampleId)}
                        </p>
                      </div>

                      {selectedExampleId &&
                        getQuickExamples(selectedExampleId).length > 0 && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase opacity-40">
                              Pruebas Rápidas
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {getQuickExamples(selectedExampleId).map(
                                (example, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setConfig((prev) => ({
                                        ...prev,
                                        tape: example.split(""),
                                      }));
                                    }}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg font-mono text-xs transition-all"
                                  >
                                    {example}
                                  </button>
                                ),
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Haz clic en un ejemplo para cargarlo
                              automáticamente
                            </p>
                          </div>
                        )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-40">
                          Símbolo Blanco (Blank)
                        </label>
                        <input
                          className="w-full p-4 bg-black/5 rounded-lg font-mono outline-none focus:ring-2 focus:ring-black"
                          value={config.blankSymbol}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              blankSymbol: e.target.value,
                            }))
                          }
                          placeholder="_"
                        />
                      </div>

                      {(state.stepCount > 0 || state.isRunning) && (
                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                          <div className="flex items-start gap-2">
                            <Info
                              size={16}
                              className="text-amber-600 mt-0.5 shrink-0"
                            />
                            <div className="space-y-2">
                              <p className="text-[11px] text-amber-800 leading-relaxed">
                                La máquina está en ejecución o ya ha ejecutado
                                pasos. Para aplicar los cambios de
                                configuración, debes reiniciarla.
                              </p>
                              <button
                                onClick={reset}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-amber-700 transition-all"
                              >
                                <RotateCcw size={14} /> Reiniciar Máquina
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
            {/* End Left Column */}

            {/* Right Column: State Graph */}
            <div className="lg:w-150 xl:w-175">
              <section className="bg-white p-8 rounded-xl border border-black/5 shadow-sm space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network size={20} />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em]">
                      Diagrama de Estados
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-black/40 uppercase font-mono">
                    <div className="w-2 h-2 rounded-full bg-black"></div> Actual
                    <div className="ml-2 w-2 h-2 rounded-full border border-black border-dashed"></div>{" "}
                    Inicio
                  </div>
                </div>
                <div className="h-150">
                  <StateGraph
                    transitions={config.transitions}
                    currentState={state.currentState}
                    initialState={config.initialState}
                  />
                </div>
              </section>
            </div>
            {/* End Right Column */}
          </div>
          {/* End Two Column Layout */}
        </div>
      </main>

      <footer className="max-w-350 mx-auto p-8 pt-0 flex justify-between items-center text-[10px] font-mono text-black/30 uppercase tracking-[0.3em]">
        <span>© 2026 Maquina Turing - Universidad Tecnologica de Pereira</span>
      </footer>
    </div>
  );
}
