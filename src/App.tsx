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
}: {
  state: TMState;
  blankSymbol: Symbol;
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

  return (
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

      {/* Pointer UI */}
      <div className="absolute bottom-4 left-1/2 -ml-3 z-30">
        <div className="w-0 h-0 bg-white  border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-10 border-b-pink"></div>
      </div>
    </div>
  );
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
  const [activeTab, setActiveTab] = useState<"rules" | "exercises" | "config">(
    "rules",
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    } else if (activeTab === "exercises" || Math.random() > 0.8) {
      getExplanation(
        state.currentState,
        state.tape,
        state.headIndex,
        rule,
        nextStateData.currentState,
      );
    }
  }, [state, config, activeTab]);

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

      <main className="max-w-350 mx-auto p-8 flex flex-col gap-8">
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Machine Header */}
          <section className="bg-white p-6 rounded-xl border border-black/5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wider text-black/40">
                  Máquina Activa
                </h2>
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    state.currentState === "accept" && "text-green-600",
                    state.currentState === "reject" && "text-red-600",
                    state.isHalted && state.stepCount === 0 && "text-orange-600",
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
            {state.isHalted && state.stepCount === 0 && (
              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex items-start gap-3">
                <Info size={18} className="text-orange-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-orange-900">
                    No se encontró ninguna regla de transición
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    La máquina no tiene una regla definida para el estado <strong>"{state.currentState}"</strong> 
                    {" "}leyendo el símbolo <strong>"{state.tape[state.headIndex] || config.blankSymbol}"</strong>.
                    {" "}Ve a la pestaña <strong>Reglas</strong> y agrega una transición apropiada.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Tape Visualization */}
          <section className="bg-white rounded-xl border border-black/5 shadow-md overflow-hidden relative">
            <TapeComponent state={state} blankSymbol={config.blankSymbol} />

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

          {/* State Graph - Full Width */}
          <section className="bg-white p-8 rounded-xl border border-black/5 shadow-sm space-y-6">
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

          {/* Sidebar Area: Tabbed Configuration */}
          <section className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col h-125">
            <div className="flex border-b border-black/5">
              {[
                { id: "rules", label: "Pasos" },
                { id: "exercises", label: "Ejercicios" },
                { id: "config", label: "Config" },
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
                                updateTransition(i, "nextState", e.target.value)
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

              {activeTab === "exercises" && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                    <Sparkles className="text-blue-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">
                        Desafíos de Autómatas
                      </h4>
                      <p className="text-xs text-blue-800 mt-1">
                        Selecciona un problema para ver cómo una Máquina de Turing lo resuelve paso a paso.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { 
                        name: "Repetir 01", 
                        id: "repeat01",
                        detail: "Esta máquina duplica el patrón '01' creando '0101'. Es un ejemplo básico de cómo copiar información en una cinta. La máquina lee los símbolos y los escribe nuevamente al final."
                      },
                      { 
                        name: "Incremento Binario", 
                        id: "binaryIncrement",
                        detail: "Suma 1 a un número binario. Por ejemplo, '1011' (11 en decimal) se convierte en '1100' (12 en decimal). La máquina trabaja de derecha a izquierda, como lo harías en papel, manejando los acarreos."
                      },
                      {
                        name: "Divisible por 3 (binario)",
                        id: "divisibleBy3Binary",
                        detail: "Verifica si un número binario es divisible por 3. Usa la propiedad de que un número binario es divisible por 3 si la suma alternada de sus dígitos es divisible por 3. Acepta la cadena si cumple la condición."
                      },
                      { 
                        name: "Copiar 1s", 
                        id: "copyOnes",
                        detail: "Copia todos los símbolos '1' de una secuencia al final de la cinta. Útil para entender cómo una máquina puede 'recordar' y reproducir información leyendo y escribiendo en diferentes posiciones."
                      },
                      {
                        name: "Divisible por 3 (base 10)",
                        id: "divisibleBy3Base10",
                        detail: "Similar al caso binario, pero trabaja con dígitos decimales (0-9). Determina si un número en base 10 es divisible por 3 usando aritmética modular. Un número es divisible por 3 si la suma de sus dígitos lo es."
                      },
                      {
                        name: "Tres cadenas de igual longitud (aⁿbⁿcⁿ)",
                        id: "threeEqualLength",
                        detail: "Este es un problema clásico que demuestra el poder de las Máquinas de Turing sobre otros autómatas. Verifica que una cadena tenga exactamente el mismo número de 'a', 'b' y 'c' en ese orden. Por ejemplo: 'aabbcc' es válida, pero 'aabbc' no."
                      },
                      { 
                        name: "Verificador de Palíndromos", 
                        id: "palindrome",
                        detail: "Determina si una palabra se lee igual de izquierda a derecha que de derecha a izquierda. Por ejemplo: '1001' es un palíndromo. La máquina compara el primer símbolo con el último, luego el segundo con el penúltimo, y así sucesivamente."
                      },
                      { 
                        name: "Suma Unaria", 
                        id: "unaryAddition",
                        detail: "Suma dos números representados en notación unaria (usando '1's). Por ejemplo, '111+11' representa 3+2. La máquina cuenta todos los '1's y produce el resultado como una secuencia continua de '1's que representa la suma."
                      },
                    ].map((ex, i) => {
                      const meta = EXAMPLES[ex.id];
                      const title = meta?.title ?? ex.name;
                      const description = ex.detail;
                      const isSelected = config === meta;

                      return (
                        <button
                          key={ex.id}
                          onClick={() => {
                            const next = EXAMPLES[ex.id];
                            if (!next) return;
                            setConfig(next);
                            setState({
                              tape: [...next.tape],
                              headIndex: 0,
                              currentState: next.initialState,
                              isRunning: false,
                              stepCount: 0,
                              isHalted: false,
                            });
                            setExplanation(next.description ?? "");
                          }}
                          className={cn(
                            "group relative w-full text-left rounded-xl border p-5 transition-all",
                            "bg-white/80 hover:bg-white",
                            "border-black/5 hover:border-black/10",
                            "shadow-sm hover:shadow-md",
                            "focus:outline-none focus:ring-2 focus:ring-black/30",
                            isSelected &&
                              "ring-2 ring-black/80 border-black/10 shadow-md",
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-slate-900">
                                  {title}
                                </span>
                                {isSelected && (
                                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-black text-white">
                                    Activo
                                  </span>
                                )}
                              </div>
                              {description && (
                                <p className="text-[11px] leading-relaxed text-slate-600">
                                  {description}
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">
                                  Ejercicio {i + 1}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[9px] font-mono text-slate-400">
                                  Estado inicial: {meta?.initialState}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[9px] font-mono text-slate-400">
                                  {meta?.transitions.length} reglas
                                </span>
                              </div>
                            </div>

                            <div
                              className={cn(
                                "mt-1 text-slate-400 transition-all",
                                "group-hover:text-slate-900",
                                "group-hover:translate-x-0.5",
                              )}
                            >
                              <ChevronRight />
                            </div>
                          </div>

                          <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-black/3 to-transparent" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "config" && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-green-600 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-green-800 leading-relaxed">
                        Los cambios en la configuración se aplican <strong>automáticamente</strong> cuando la máquina está en estado inicial (sin pasos ejecutados).
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase opacity-40">
                      Contenido Inicial de la Cinta
                    </label>
                    <input
                      className="w-full p-4 bg-black/5 rounded-lg font-mono outline-none focus:ring-2 focus:ring-black"
                      value={config.tape.join("")}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          tape: e.target.value.split(""),
                        }))
                      }
                      placeholder="Ejemplo: 1011"
                    />
                  </div>
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
                        <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                        <div className="space-y-2">
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            La máquina está en ejecución o ya ha ejecutado pasos. Para aplicar los cambios de configuración, debes reiniciarla.
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
                  
                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={exportLog}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Save size={16} /> Exportar Log
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob(
                          [JSON.stringify(config, null, 2)],
                          { type: "application/json" },
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `maquina-turing-${Date.now()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border border-black/10 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                      <Download size={16} /> Exportar JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="max-w-350 mx-auto p-8 pt-0 flex justify-between items-center text-[10px] font-mono text-black/30 uppercase tracking-[0.3em]">
        <span>© 2026 Maquina Turing - Universidad Tecnologica de Pereira</span>
      </footer>
    </div>
  );
}
