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
  Cpu,
  BookOpen,
  Plus,
  Trash2,
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
  readIndices,
}: {
  state: TMState;
  blankSymbol: Symbol;
  lastMove: "L" | "R" | "N" | null;
  readIndices: Set<number>;
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
      value: state.tape[i] !== undefined ? state.tape[i] : blankSymbol,
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
            {cells.map((cell) => {
              const isHead = cell.index === state.headIndex;
              const wasRead = readIndices.has(cell.index) && !isHead;
              return (
                <motion.div
                  key={cell.index}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isHead ? 1.1 : 1,
                    x: (cell.index - state.headIndex) * 64,
                    zIndex: isHead ? 20 : 10,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                  className={cn(
                    "absolute w-14 h-14 flex items-center justify-center border font-mono text-lg transition-colors",
                    isHead
                      ? "bg-black text-white border-black shadow-xl"
                      : wasRead
                        ? "bg-amber-100 text-amber-900 border-amber-400 shadow-md"
                        : "bg-white text-black border-black/10",
                  )}
                >
                  {cell.value}
                  {isHead && (
                    <div className="absolute -top-8 text-[10px] font-bold text-black uppercase tracking-tighter">
                      Cabezal
                    </div>
                  )}
                  {wasRead && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 border border-amber-600" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 text-[10px] font-mono text-black/40 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-black inline-block" />
          Cabezal actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-400 inline-block" />
          Ya leída
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white border border-black/10 inline-block" />
          Sin leer
        </span>
      </div>
    </div>
  );
};

// Helper functions
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
      valid: true,
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

const generateDynamicPalindromeTransitions = (
  inputSymbols: string[],
): TMConfig["transitions"] => {
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
  uniqueSymbols.forEach((symbol) => {
    transitions.push({
      currentState: "q0",
      readSymbol: symbol,
      writeSymbol: "X",
      move: "R",
      nextState: `q_search_${symbol}`,
    });
  });
  transitions.push({
    currentState: "q0",
    readSymbol: "_",
    writeSymbol: "_",
    move: "N",
    nextState: "accept",
  });
  transitions.push({
    currentState: "q0",
    readSymbol: "X",
    writeSymbol: "X",
    move: "R",
    nextState: "q_skip",
  });
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
  uniqueSymbols.forEach((symbol) => {
    const searchState = `q_search_${symbol}`;
    const returnState = `q_return_${symbol}`;
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
    transitions.push({
      currentState: searchState,
      readSymbol: "_",
      writeSymbol: "_",
      move: "L",
      nextState: returnState,
    });
    transitions.push({
      currentState: returnState,
      readSymbol: symbol,
      writeSymbol: "X",
      move: "L",
      nextState: "q_back",
    });
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
    transitions.push({
      currentState: returnState,
      readSymbol: "X",
      writeSymbol: "X",
      move: "N",
      nextState: "reject",
    });
  });
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

// ─── Estado inicial de la máquina a partir de una config ───────────────────
const buildInitialMachineState = (cfg: TMConfig): TMState => ({
  tape: [...cfg.tape],
  headIndex: 0,
  currentState: cfg.initialState,
  isRunning: false,
  stepCount: 0,
  isHalted: false,
});

export default function App() {
  // config sólo cambia cuando el usuario selecciona un ejercicio o edita reglas/cinta
  const [config, setConfig] = useState<TMConfig>(EXAMPLES.binaryIncrement);
  // machineState es la ejecución en curso — NUNCA se resetea por efectos secundarios
  const [machineState, setMachineState] = useState<TMState>(
    buildInitialMachineState(EXAMPLES.binaryIncrement),
  );

  const [speed, setSpeed] = useState(500);
  const [explanation, setExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeTab, setActiveTab] = useState<"rules" | "config">("rules");
  const [selectedExampleId, setSelectedExampleId] =
    useState<string>("binaryIncrement");
  const [dynamicMode, setDynamicMode] = useState(false);
  const [lastMove, setLastMove] = useState<"L" | "R" | "N" | null>(null);
  const [readIndices, setReadIndices] = useState<Set<number>>(new Set());

  // Refs para el loop de ejecución — evita stale closures
  const machineStateRef = useRef(machineState);
  const configRef = useRef(config);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    machineStateRef.current = machineState;
  }, [machineState]);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // ── Modo dinámico: regenerar transiciones solo cuando la cinta cambia y la
  //    máquina NO está corriendo y no ha ejecutado pasos ──────────────────────
  useEffect(() => {
    if (!dynamicMode) return;
    if (machineState.isRunning || machineState.stepCount > 0) return;
    const newTransitions = generateDynamicPalindromeTransitions(config.tape);
    setConfig((prev) => ({ ...prev, transitions: newTransitions }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.tape, dynamicMode]);

  // ── Reset explícito ────────────────────────────────────────────────────────
  const reset = useCallback((cfg?: TMConfig) => {
    const targetConfig = cfg ?? configRef.current;
    if (timerRef.current) clearInterval(timerRef.current);
    isRunningRef.current = false;
    const fresh = buildInitialMachineState(targetConfig);
    setMachineState(fresh);
    machineStateRef.current = fresh;
    setExplanation("");
    setLastMove(null);
    setReadIndices(new Set());
  }, []);

  // ── Un paso de la máquina — usa refs para no quedar desactualizado ─────────
  const stepOnce = useCallback(() => {
    const st = machineStateRef.current;
    const cfg = configRef.current;

    if (st.isHalted) return;

    const currentSymbol =
      st.tape[st.headIndex] !== undefined
        ? st.tape[st.headIndex]
        : cfg.blankSymbol;

    const rule = cfg.transitions.find(
      (t) =>
        t.currentState === st.currentState && t.readSymbol === currentSymbol,
    );

    if (!rule) {
      // Sin regla → detener
      const halted: TMState = { ...st, isHalted: true, isRunning: false };
      setMachineState(halted);
      machineStateRef.current = halted;
      isRunningRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);

      getExplanation(
        st.currentState,
        st.tape,
        st.headIndex,
        {
          currentState: st.currentState,
          readSymbol: currentSymbol,
          writeSymbol: currentSymbol,
          move: "N",
          nextState: st.currentState,
        },
        st.currentState,
        true,
      );
      if (st.currentState === "accept")
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      return;
    }

    // Aplicar transición
    const newTape = [...st.tape];
    newTape[st.headIndex] = rule.writeSymbol;

    let newHead = st.headIndex;
    if (rule.move === "L") newHead--;
    if (rule.move === "R") newHead++;

    if (newHead < 0) {
      newTape.unshift(cfg.blankSymbol);
      newHead = 0;
      // Ajustar readIndices: todos los índices se desplazan +1
      setReadIndices((prev) => {
        const shifted = new Set<number>();
        prev.forEach((idx) => shifted.add(idx + 1));
        shifted.add(1); // la celda que acabamos de leer (era índice 0, ahora es 1)
        return shifted;
      });
    } else {
      setReadIndices((prev) => new Set(prev).add(st.headIndex));
    }

    if (newHead >= newTape.length) newTape.push(cfg.blankSymbol);

    const isHalted =
      rule.nextState === "halt" ||
      rule.nextState === "accept" ||
      rule.nextState === "reject";

    const next: TMState = {
      tape: newTape,
      headIndex: newHead,
      currentState: rule.nextState,
      isRunning: !isHalted && st.isRunning,
      stepCount: st.stepCount + 1,
      isHalted,
    };

    setMachineState(next);
    machineStateRef.current = next;
    setLastMove(rule.move);

    if (isHalted) {
      isRunningRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (next.currentState === "accept")
        confetti({ particleCount: 150, spread: 100 });
      getExplanation(
        st.currentState,
        st.tape,
        st.headIndex,
        rule,
        next.currentState,
        true,
      );
    } else if (Math.random() > 0.85) {
      getExplanation(
        st.currentState,
        st.tape,
        st.headIndex,
        rule,
        next.currentState,
      );
    }
  }, []); // Sin dependencias — usa solo refs

  // ── Timer de ejecución automática ─────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isRunningRef.current || machineStateRef.current.isHalted) {
        clearInterval(timerRef.current!);
        return;
      }
      stepOnce();
    }, speed);
  }, [speed, stepOnce]);

  const toggleRun = useCallback(() => {
    if (machineState.isHalted) return;
    const nowRunning = !isRunningRef.current;
    isRunningRef.current = nowRunning;
    setMachineState((prev) => ({ ...prev, isRunning: nowRunning }));
    machineStateRef.current = {
      ...machineStateRef.current,
      isRunning: nowRunning,
    };

    if (nowRunning) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [machineState.isHalted, startTimer]);

  // Cuando cambia speed y está corriendo, reinicar el timer con nueva velocidad
  useEffect(() => {
    if (isRunningRef.current) startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const getExplanation = async (
    currState: string,
    tape: Symbol[],
    head: number,
    rule: Transition,
    nextState: string,
    isHalt = false,
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
    setConfig((prev) => ({
      ...prev,
      transitions: prev.transitions.filter((_, i) => i !== index),
    }));
  };

  const handleExampleChange = (exampleId: string) => {
    if (!exampleId || !EXAMPLES[exampleId]) {
      setSelectedExampleId("");
      return;
    }
    setSelectedExampleId(exampleId);
    const example = EXAMPLES[exampleId];
    const isDynamic = exampleId === "palindromeGeneral";
    setDynamicMode(isDynamic);

    let finalConfig = example;
    if (isDynamic) {
      finalConfig = {
        ...example,
        transitions: generateDynamicPalindromeTransitions(example.tape),
      };
    }
    setConfig(finalConfig);
    configRef.current = finalConfig;
    reset(finalConfig);
  };

  const handleTapeChange = (newTapeStr: string) => {
    const newTape = newTapeStr.split("");
    const updatedConfig = { ...config, tape: newTape };
    setConfig(updatedConfig);
    configRef.current = updatedConfig;
    // Solo resetear si la máquina no ha ejecutado pasos
    if (machineState.stepCount === 0 && !machineState.isRunning) {
      reset(updatedConfig);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEAE6] text-black font-sans selection:bg-black selection:text-white">
      <Header />

      <main className="max-w-450 mx-auto p-8 flex flex-col gap-8">
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
                    machineState.currentState === "accept" && "text-green-600",
                    machineState.currentState === "reject" && "text-red-600",
                    machineState.isHalted &&
                      machineState.stepCount === 0 &&
                      "text-orange-600",
                  )}
                >
                  {machineState.isHalted
                    ? machineState.currentState === "accept"
                      ? "Cadena Aceptada ✓"
                      : machineState.currentState === "reject"
                        ? "Cadena Rechazada ✗"
                        : machineState.stepCount === 0
                          ? "Sin regla para comenzar - Verifica tu configuración"
                          : "Simulación Finalizada"
                    : "Ejecución del Simulador"}
                </p>
              </div>

              {/* Exercise Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-black/40 tracking-wider">
                  Seleccionar Ejercicio
                </label>
                <select
                  value={selectedExampleId}
                  onChange={(e) => handleExampleChange(e.target.value)}
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
                    {machineState.currentState}
                  </span>
                </div>
                <div className="flex flex-col items-end border-l border-black/10 pl-4 ml-2">
                  <span className="text-[10px] font-mono text-black/40 uppercase">
                    Pasos
                  </span>
                  <span className="font-mono font-medium">
                    {machineState.stepCount}
                  </span>
                </div>
              </div>
            </div>

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

            {machineState.isHalted && machineState.stepCount === 0 && (
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
                <Info size={18} className="text-orange-600 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-900">
                    No se encontró ninguna regla de transición
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    La máquina no tiene una regla definida para el estado{" "}
                    <strong>"{machineState.currentState}"</strong> leyendo el
                    símbolo{" "}
                    <strong>
                      "
                      {machineState.tape[machineState.headIndex] ??
                        config.blankSymbol}
                      "
                    </strong>
                    .
                  </p>
                  <p className="text-xs text-orange-600 leading-relaxed pt-1">
                    {selectedExampleId
                      ? "Puedes probar con otra entrada o agregar tus propias reglas en la pestaña Reglas."
                      : "Ve a la pestaña Reglas y agrega una transición apropiada."}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Tape */}
              <section className="bg-white rounded-xl border border-black/5 shadow-md overflow-hidden relative">
                <TapeComponent
                  state={machineState}
                  blankSymbol={config.blankSymbol}
                  lastMove={lastMove}
                  readIndices={readIndices}
                />

                {/* Controls */}
                <div className="px-8 py-6 flex items-center justify-between bg-white border-t border-black/5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleRun}
                      disabled={machineState.isHalted}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        machineState.isRunning
                          ? "bg-slate-100 text-black hover:bg-slate-200"
                          : "bg-black text-white hover:scale-105 active:scale-95 disabled:bg-slate-200",
                      )}
                    >
                      {machineState.isRunning ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (!machineState.isRunning && !machineState.isHalted)
                          stepOnce();
                      }}
                      disabled={machineState.isRunning || machineState.isHalted}
                      className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
                    >
                      <SkipForward size={20} />
                    </button>
                    <button
                      onClick={() => reset()}
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

              {/* Config Tabs */}
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
                                escribir cualquier cadena para experimentar. Los
                                cambios se aplican automáticamente antes de
                                ejecutar.
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
                              Los cambios en la cinta se aplican{" "}
                              <strong>automáticamente</strong> cuando la máquina
                              aún no ha ejecutado pasos. Si ya ejecutó, reinicia
                              primero.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Modo Dinámico */}
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
                                  Genera automáticamente las reglas basadas en
                                  los símbolos de tu entrada.
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
                                  ✅ <strong>Activo:</strong> Transiciones
                                  generadas automáticamente.{" "}
                                  <span className="text-[9px] text-purple-600">
                                    {config.transitions.length} reglas actuales.
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
                          onChange={(e) => handleTapeChange(e.target.value)}
                          placeholder={getPlaceholderForExample(
                            selectedExampleId,
                          )}
                        />
                        {selectedExampleId &&
                          (() => {
                            const v = validateInput(
                              config.tape.join(""),
                              selectedExampleId,
                            );
                            if (v.warning)
                              return (
                                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-2">
                                  <Info
                                    size={14}
                                    className="text-yellow-600 mt-0.5 shrink-0"
                                  />
                                  <p className="text-[10px] text-yellow-800 leading-relaxed">
                                    {v.warning}
                                  </p>
                                </div>
                              );
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
                                    onClick={() => handleTapeChange(example)}
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

                      {(machineState.stepCount > 0 ||
                        machineState.isRunning) && (
                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                          <div className="flex items-start gap-2">
                            <Info
                              size={16}
                              className="text-amber-600 mt-0.5 shrink-0"
                            />
                            <div className="space-y-2">
                              <p className="text-[11px] text-amber-800 leading-relaxed">
                                La máquina ya ha ejecutado pasos. Para cambiar
                                la entrada debes reiniciarla.
                              </p>
                              <button
                                onClick={() => reset()}
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
                    currentState={machineState.currentState}
                    initialState={config.initialState}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-350 mx-auto p-8 pt-0 flex justify-between items-center text-[10px] font-mono text-black/30 uppercase tracking-[0.3em]">
        <span>© 2026 Maquina Turing - Universidad Tecnologica de Pereira</span>
      </footer>
    </div>
  );
}
