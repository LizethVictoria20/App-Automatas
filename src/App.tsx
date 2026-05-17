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
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-10 border-b-black"></div>
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
  const [activeTab, setActiveTab] = useState<
    "rules" | "exercises" | "config" | "graph"
  >("graph");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

      <main className="max-w-350 mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Simulator */}
        <div className="lg:col-span-8 flex flex-col gap-8">
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
                  )}
                >
                  {state.isHalted
                    ? state.currentState === "accept"
                      ? "Cadena Aceptada ✓"
                      : state.currentState === "reject"
                        ? "Cadena Rechazada ✗"
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

          {/* Sidebar Area: Tabbed Configuration */}
          <section className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col h-125">
            <div className="flex border-b border-black/5">
              {[
                { id: "rules", label: "Reglas" },
                { id: "graph", label: "Gráfico" },
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
              {activeTab === "graph" && (
                <div className="h-full flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Diagrama de Estados</h3>
                    <div className="flex items-center gap-2 text-[10px] text-black/40 uppercase font-mono">
                      <div className="w-2 h-2 rounded-full bg-black"></div>{" "}
                      Actual
                      <div className="ml-2 w-2 h-2 rounded-full border border-black border-dashed"></div>{" "}
                      Inicio
                    </div>
                  </div>
                  <div className="flex-1 min-h-75">
                    <StateGraph
                      transitions={config.transitions}
                      currentState={state.currentState}
                      initialState={config.initialState}
                    />
                  </div>
                </div>
              )}

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

                {activeTab === 'exercises' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                      <Sparkles className="text-blue-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-blue-900">Desafíos de Autómatas</h4>
                        <p className="text-xs text-blue-800 mt-1">Selecciona un problema para resolverlo.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[{ name: 'Incremento Binario', id: 'binaryIncrement' }, { name: 'Verificador de Palíndromos', id: 'palindrome' }, { name: 'Suma Unaria', id: 'unary' }, { name: '3-state Busy Beaver', id: 'exercise12' }, { name: '4-State Busy Beaver', id: 'busyBeaver4State' }, { name: 'Powers of Two', id: 'powersOfTwo' }].map((ex, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            if (ex.id === 'binaryIncrement') setConfig(EXAMPLES.binaryIncrement);
                            if (ex.id === 'palindrome') setConfig(EXAMPLES.palindrome);
                            if (ex.id === 'unary') setConfig(EXAMPLES.unaryAddition);
                            if (ex.id === 'exercise12') setConfig(EXAMPLES.exercise12);
                            if (ex.id === 'busyBeaver4State') setConfig(EXAMPLES.busyBeaver4State);
                            if (ex.id === 'powersOfTwo') setConfig(EXAMPLES.powersOfTwo);
                            reset();
                          }}
                          className="flex items-center justify-between p-4 border border-black/5 rounded-lg hover:bg-black hover:text-white transition-all group"
                        >
                          <div className="text-left">
                            <span className="block text-sm font-medium">{ex.name}</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-50">Set de Problemas {i+1}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "config" && (
                <div className="space-y-6">
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
                    />
                  </div>
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

        {/* Right Column: AI & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Machine Theory */}
          <section className="bg-white p-8 rounded-xl border border-black/5 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen size={18} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                Conceptos
              </h3>
            </div>

            <div className="space-y-4">
              {config === EXAMPLES.exercise12 ? (
                <>
                  <div className="p-4 rounded-lg bg-[#F8F8F7] border border-black/5">
                    <h4 className="text-xs font-bold mb-1">Busy Beaver Problem</h4>
                    <p className="text-[11px] leading-relaxed text-black/60">
                      Entre todas las máquinas de Turing con n estados y k símbolos que haltan en una cinta en blanco, ¿cuál deja el máximo número de símbolos no-blancos? Ese es el busy beaver.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8F8F7] border border-black/5">
                    <h4 className="text-xs font-bold mb-1">Fórmula de Máquinas Posibles</h4>
                    <p className="text-[11px] leading-relaxed text-black/60 font-mono">
                      (2k(n+1))^(nk)
                    </p>
                    <p className="text-[10px] leading-relaxed text-black/50 mt-2">
                      Donde n = estados (sin contar halt), k = símbolos
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <h4 className="text-xs font-bold mb-1 text-blue-900">Ejercicio 12</h4>
                    <p className="text-[10px] leading-relaxed text-blue-800">
                      Este busy beaver toma 21 pasos e imprime 5 símbolos. Observa cómo la máquina alterna entre estados, escribiendo y moviéndose estratégicamente.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-[#F8F8F7] border border-black/5">
                    <h4 className="text-xs font-bold mb-1">Máquina de Estados</h4>
                    <p className="text-[11px] leading-relaxed text-black/60">
                      Una máquina de Turing es un modelo matemático de computación que manipula símbolos en una cinta de acuerdo con una tabla de reglas.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8F8F7] border border-black/5">
                    <h4 className="text-xs font-bold mb-1">Problema de la Parada</h4>
                    <p className="text-[11px] leading-relaxed text-black/60">
                      No existe un algoritmo general que pueda determinar si un programa se detendrá eventualmente o se ejecutará para siempre. Esta máquina explora ese límite.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8F8F7] border border-black/5">
                    <h4 className="text-xs font-bold mb-1">Estado de Parada (Halt)</h4>
                    <p className="text-[11px] leading-relaxed text-black/60">
                      Es el estado terminal donde la máquina finaliza su ejecución. Indica que el cómputo ha terminado, ya sea porque se llegó a una solución (Aceptar/Rechazar) o porque no existen más reglas aplicables para la configuración actual.
                    </p>
                  </div>
                </>
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
