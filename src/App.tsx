import { useState, useEffect, useCallback, useRef } from 'react';
import { EXERCISES } from './data/exercises';
import { initializeState, stepMachine, getAlphabetFromTape } from './utils/turingInterpreter';
import { RuntimeState, StepHistory, TransitionRule } from './types';
import { TapeVisualizer } from './components/TapeVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { StateGraph } from './components/StateGraph';
import { RulesTable } from './components/RulesTable';
import { HelpSection } from './components/HelpSection';
import { 
  Play, 
  RotateCcw, 
  Cpu, 
  ClipboardList, 
  HelpCircle, 
  History, 
  Sparkle,
  Scale,
  BrainCircuit,
  Heart,
  Sparkles,
  X,
  Award
} from 'lucide-react';

export default function App() {
  // Active Exercise Selected Index
  const [exerciseIndex, setExerciseIndex] = useState(1); // Default to Binary Increment
  const activeConfig = EXERCISES[exerciseIndex];

  // Turing Machine Runtime state
  const [runtimeState, setRuntimeState] = useState<RuntimeState>(() => 
    initializeState(activeConfig)
  );

  // Local overrides/customizations of rules
  const [localRules, setLocalRules] = useState<TransitionRule[]>(activeConfig.rules);

  // History states for the "Step Backward" feature
  const [history, setHistory] = useState<StepHistory[]>([]);

  // Simulation speed in ms
  const [speed, setSpeed] = useState(400);

  // Automatic running timer flag
  const [isPlaying, setIsPlaying] = useState(false);

  // Instant Run-To-End mode
  const [instantRun, setInstantRun] = useState(false);

  // Terminal log statements
  const [logs, setLogs] = useState<string[]>([]);

  // Reference for log terminal scrolling
  const logTerminalRef = useRef<HTMLDivElement>(null);

  // Show / hide the simulation result modal overlay
  const [showResultModal, setShowResultModal] = useState(false);

  // Synchronize modal state with simulation final results (accepted or rejected)
  useEffect(() => {
    if (['accepted', 'rejected'].includes(runtimeState.status)) {
      setShowResultModal(true);
    } else {
      setShowResultModal(false);
    }
  }, [runtimeState.status]);

  // Sync state if exercise config changes
  useEffect(() => {
    const freshState = initializeState(activeConfig);
    setRuntimeState(freshState);
    setHistory([]);
    setLogs([`Cargado ejercicio: "${activeConfig.name}". Máquina de Turing inicializada.`]);
    
    // Handle dynamic rule rendering for adaptative palidromes
    if (activeConfig.generateRulesForAlphabet) {
      const currentAlphabet = getAlphabetFromTape(freshState.tape, activeConfig.blankSymbol);
      setLocalRules(activeConfig.generateRulesForAlphabet(currentAlphabet, activeConfig.blankSymbol));
    } else {
      setLocalRules(activeConfig.rules);
    }
  }, [exerciseIndex, activeConfig]);

  // Append new statements to our visible logger console
  const appendLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg]);
    // Auto scroll to bottom of logs shell
    setTimeout(() => {
      if (logTerminalRef.current) {
        logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  // Action: Step Forward exactly one transition
  const handleStepForward = useCallback(() => {
    setRuntimeState((prev) => {
      // If we are already halted or finished, do not advance
      if (['accepted', 'rejected', 'halted', 'error'].includes(prev.status)) {
        setIsPlaying(false);
        return prev;
      }

      // Add actual configuration to compute step with custom and generated rules
      const stepConfig = {
        ...activeConfig,
        rules: localRules
      };

      const next = stepMachine(prev, stepConfig);

      // Save previous state to history
      setHistory((prevHist) => [
        ...prevHist,
        {
          tape: { ...prev.tape },
          headPosition: prev.headPosition,
          currentState: prev.currentState,
          stepCount: prev.stepCount,
          status: prev.status,
          lastRuleId: prev.lastRuleId,
          lastDirection: prev.lastDirection,
        },
      ]);

      const currentSymbol = prev.tape[prev.headPosition] ?? activeConfig.blankSymbol;
      const matchedRule = localRules.find(
        (r) => r.fromState === prev.currentState && r.readSymbol === currentSymbol
      );

      // Build readable translation step log
      if (matchedRule) {
        appendLog(
          `Paso ${next.stepCount}: [${prev.currentState}] lee "${currentSymbol}" ` +
          `→ escribe "${matchedRule.writeSymbol}", mueve ${
            matchedRule.direction === 'L' ? 'Izquierda (L)' : matchedRule.direction === 'R' ? 'Derecha (R)' : 'Inmóvil (N)'
          } → va a [${matchedRule.toState}]`
        );
      } else {
        if (next.status === 'accepted') {
          appendLog(`Paso ${next.stepCount}: Aceptado. No más transiciones en el estado final de aceptación [${prev.currentState}].`);
        } else {
          appendLog(`Paso ${next.stepCount}: Rechazado. No se encontró ninguna regla para [${prev.currentState}] leyendo "${currentSymbol}".`);
        }
      }

      // Automatically halt play if we arrived at accepted/rejected state
      if (['accepted', 'rejected', 'halted', 'error'].includes(next.status)) {
        setIsPlaying(false);
        if (next.status === 'accepted') {
          appendLog(`★ ENTRADA ACEPTADA CREADA CON ÉXITO: La máquina resolvió en ${next.stepCount} pasos.`);
        } else if (next.status === 'rejected') {
          appendLog(`⚠ ENTRADA RECHAZADA: Se detuvo en estado de fallo tras ${next.stepCount} pasos.`);
        }
      }

      return next;
    });
  }, [activeConfig, localRules, appendLog]);

  // Action: Step Backward (Restore previous tape layouts from history)
  const handleStepBackward = useCallback(() => {
    if (history.length === 0) return;

    const previousHistoryItem = history[history.length - 1];
    setHistory((prevHist) => prevHist.slice(0, -1));

    setRuntimeState({
      tape: previousHistoryItem.tape,
      headPosition: previousHistoryItem.headPosition,
      currentState: previousHistoryItem.currentState,
      stepCount: previousHistoryItem.stepCount,
      status: previousHistoryItem.status,
      lastRuleId: previousHistoryItem.lastRuleId,
      lastDirection: previousHistoryItem.lastDirection,
    });

    appendLog(`↩ Deshacer: Volviendo al Paso ${previousHistoryItem.stepCount} (Estado [${previousHistoryItem.currentState}])`);
    setIsPlaying(false);
  }, [history, appendLog]);

  // Action: Reset entire machine to original parameters
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    const freshState = initializeState(activeConfig);
    setRuntimeState(freshState);
    setHistory([]);
    setLogs([`Máquina restablecida. Sistema configurado en el estado inicial [${activeConfig.initialState}].`]);
    
    if (activeConfig.generateRulesForAlphabet) {
      const currentAlphabet = getAlphabetFromTape(freshState.tape, activeConfig.blankSymbol);
      setLocalRules(activeConfig.generateRulesForAlphabet(currentAlphabet, activeConfig.blankSymbol));
    } else {
      setLocalRules(activeConfig.rules);
    }
  }, [activeConfig]);

  // Action: Clear all cells on tape to start fresh manually
  const handleClearTape = useCallback(() => {
    setIsPlaying(false);
    setRuntimeState((prev) => ({
      ...prev,
      tape: {}, // Clear all keys
      headPosition: 0,
      currentState: activeConfig.initialState,
      status: 'idle',
      stepCount: 0,
      lastRuleId: undefined,
      lastDirection: undefined,
    }));
    setHistory([]);
    setLogs(['Lienzo de cinta vaciado. Listo para ingresar datos manuales.']);
  }, [activeConfig]);

  // Action: Load custom tape text string
  const handleCustomInputLoad = useCallback((text: string) => {
    setIsPlaying(false);
    const freshState = initializeState(activeConfig, text);
    setRuntimeState(freshState);
    setHistory([]);
    setLogs([`Entrada manual cargada: "${text}". Estado de la máquina inicializado en [${activeConfig.initialState}].`]);
    
    if (activeConfig.generateRulesForAlphabet) {
      const currentAlphabet = getAlphabetFromTape(freshState.tape, activeConfig.blankSymbol);
      setLocalRules(activeConfig.generateRulesForAlphabet(currentAlphabet, activeConfig.blankSymbol));
    }
  }, [activeConfig]);

  // Action: Modify individual cell on tape (Live editing)
  const handleCellChange = useCallback((index: number, val: string) => {
    setRuntimeState((prev) => {
      const nextTape = { ...prev.tape, [index]: val };
      
      // If we are on dynamic rules (like general palindrome), any cell change might alter alphabet/transitions
      if (activeConfig.generateRulesForAlphabet) {
        const currentAlphabet = getAlphabetFromTape(nextTape, activeConfig.blankSymbol);
        setLocalRules(activeConfig.generateRulesForAlphabet(currentAlphabet, activeConfig.blankSymbol));
      }
      
      return {
        ...prev,
        tape: nextTape,
      };
    });
    appendLog(`Celda modificada en índice [${index}] con valor "${val}".`);
  }, [activeConfig, appendLog]);

  // Action: Manage custom rule override lists
  const handleAddCustomRule = useCallback((newRule: Omit<TransitionRule, 'id'>) => {
    const formatted: TransitionRule = {
      ...newRule,
      id: `custom-rule-${Date.now()}`
    };
    setLocalRules((prev) => [...prev, formatted]);
    appendLog(`Regla registrada: [${newRule.fromState}] lee "${newRule.readSymbol}" → escribe "${newRule.writeSymbol}", mueve ${newRule.direction} → va a [${newRule.toState}]`);
  }, [appendLog]);

  const handleDeleteRule = useCallback((id: string) => {
    setLocalRules((prev) => prev.filter(r => r.id !== id));
    appendLog(`Instrucción eliminada de la tabla de control.`);
  }, [appendLog]);

  // Loop: Automatic solver playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      handleStepForward();
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, handleStepForward]);

  // Playback Toggle Handlers
  const handlePlay = () => {
    if (instantRun) {
      // Execute the machine instantly up to 2500 steps to prevent freezing
      let tempState = { ...runtimeState };
      const stepConfig = { ...activeConfig, rules: localRules };
      const batchLogs: string[] = [];
      const batchHistory: StepHistory[] = [];
      let limit = 2500;
      
      batchLogs.push(`⚡ Iniciando cálculo instantáneo (Límite: ${limit} operaciones)...`);
      
      while (
        !['accepted', 'rejected', 'halted', 'error'].includes(tempState.status) && 
        limit > 0
      ) {
        const prev = tempState;
        const next = stepMachine(prev, stepConfig);
        
        batchHistory.push({
          tape: { ...prev.tape },
          headPosition: prev.headPosition,
          currentState: prev.currentState,
          stepCount: prev.stepCount,
          status: prev.status,
          lastRuleId: prev.lastRuleId,
          lastDirection: prev.lastDirection,
        });

        const currentSymbol = prev.tape[prev.headPosition] ?? activeConfig.blankSymbol;
        const matchedRule = localRules.find(
          (r) => r.fromState === prev.currentState && r.readSymbol === currentSymbol
        );

        if (matchedRule) {
          batchLogs.push(
            `Paso ${next.stepCount}: [${prev.currentState}] lee "${currentSymbol}" → escribe "${matchedRule.writeSymbol}" → va a [${matchedRule.toState}]`
          );
        }
        
        tempState = next;
        limit--;
      }

      if (limit === 0) {
        batchLogs.push(`⚠ Límite de seguridad alcanzado (${2500} pasos). Se detuvo la máquina para evitar un bucle no computable.`);
        tempState.status = 'rejected';
      } else {
        if (tempState.status === 'accepted') {
          batchLogs.push(`★ ENTRADA ACEPTADA: Resuelto perfectamente en ${tempState.stepCount} pasos.`);
        } else if (tempState.status === 'rejected') {
          batchLogs.push(`⚠ ENTRADA RECHAZADA: Proceso culminó en fallo tras ${tempState.stepCount} pasos.`);
        }
      }

      setHistory((prev) => [...prev, ...batchHistory]);
      setRuntimeState(tempState);
      setLogs((prev) => [...prev, ...batchLogs]);
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-bg-base pb-16 font-sans antialiased text-ink">
      
      {/* Top Header Deck */}
      <header className="bg-white border-b border-line py-4 px-6 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          <div className="flex items-center gap-3">
            <div className="p-2 border border-line bg-bg-base text-ink flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold italic text-2xl text-ink tracking-tight">
                  TuringLab
                </h1>
              </div>
              <p className="text-[11px] text-ink/70 font-sans mt-0.5 uppercase tracking-wider font-semibold">
                Simulador interactivo de autómata determinista de Turing
              </p>
            </div>
          </div>

          {/* Catalog Selector Dropdown */}
          <div className="flex items-center gap-3 bg-[#DFCAEC] border border-line px-4 py-2 shrink-0">
            <span className="font-serif text-xs font-bold italic text-ink select-none">
              Programa / Rutina:
            </span>
            <select
              value={exerciseIndex}
              disabled={isPlaying}
              onChange={(e) => setExerciseIndex(Number(e.target.value))}
              className="bg-white border border-line rounded-none outline-none font-sans text-xs font-bold px-3 py-1 cursor-pointer text-ink hover:bg-white/85 transition-colors uppercase tracking-wider"
            >
              {EXERCISES.map((ex, idx) => (
                <option key={ex.id} value={idx}>
                  {idx + 1}. {ex.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Dynamic Exercise Details Banner */}
        <div className="bg-white border border-line p-6 md:p-8 mb-6 relative">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-line bg-[#DFCAEC] text-ink text-[10px] font-bold font-mono tracking-wide uppercase mb-3">
              <Sparkle className="w-3.5 h-3.5 text-accent fill-accent/20" />
              Especificación Teórica
            </div>
            
            <h2 className="font-serif font-bold italic text-2xl md:text-3xl tracking-tight mb-2 text-ink">
              {activeConfig.name}
            </h2>
            
            <p className="font-sans text-xs text-ink/80 leading-relaxed max-w-3xl mb-4 font-normal">
              {activeConfig.description}
            </p>

            <div className="bg-bg-base/60 border border-line p-4 text-xs font-sans text-ink leading-relaxed">
              <strong className="font-serif font-bold italic text-ink block mb-1">Criterio Académico & Funcionamiento:</strong>
              {activeConfig.educationalExplanation}
            </div>
          </div>
        </div>

        {/* Master Interactive Dashboard: Sidebar-coupled split cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
          
          {/* LEFT: Simulation Cockpit (Tape + Controls + Stepping Logs) (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            
            {/* Memory Tape Slot */}
            <div className="w-full">
              <TapeVisualizer
                tape={runtimeState.tape}
                headPosition={runtimeState.headPosition}
                blankSymbol={activeConfig.blankSymbol}
                status={runtimeState.status}
                onCellChange={handleCellChange}
                lastDirection={runtimeState.lastDirection}
              />
            </div>

            {/* Simulation Controller */}
            <ControlPanel
              config={activeConfig}
              status={runtimeState.status}
              stepCount={runtimeState.stepCount}
              speed={speed}
              onSpeedChange={setSpeed}
              onPlay={handlePlay}
              onPause={handlePause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onClearTape={handleClearTape}
              onCustomInputLoad={handleCustomInputLoad}
              canBackward={history.length > 0}
              canForward={!['accepted', 'rejected', 'halted', 'error'].includes(runtimeState.status)}
              currentState={runtimeState.currentState}
              errorMsg={runtimeState.errorMsg}
              instantRun={instantRun}
              onInstantRunChange={setInstantRun}
            />

            {/* Step Trace Terminal Logs */}
            <div className="bg-white border border-line text-ink p-5 flex flex-col min-h-[300px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-line mb-3 select-none">
                <span className="font-serif font-bold italic text-xs tracking-wider uppercase text-ink flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-accent"></span>
                  Trazado de Pasos (System Log)
                </span>
                <span className="font-mono text-[9px] text-ink opacity-60">
                  OPERACIONES: {logs.length}
                </span>
              </div>

              {/* Terminal Logs Window */}
              <div
                ref={logTerminalRef}
                className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-2 font-mono text-[10px] text-ink/90 leading-relaxed scrollbar-thin"
              >
                {logs.map((log, idx) => (
                  <div
                    key={`log-${idx}`}
                    className={`pb-1 border-b border-dashed border-line/30 last:border-0 ${
                      log.startsWith('★')
                        ? 'text-accent font-bold'
                        : log.startsWith('⚠')
                        ? 'text-accent border-l-2 border-accent pl-1.5'
                        : log.startsWith('⚡')
                        ? 'text-ink font-bold font-serif italic'
                        : 'text-ink/85'
                    }`}
                  >
                    <span className="text-accent/60 mr-1.5 select-none font-sans font-bold">
                      &gt;&gt;
                    </span>
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-ink/50 text-center py-16 font-mono text-[10px]">
                    Inicia el autómata para empezar a trazar logs de ejecución.
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-line flex justify-between text-[9px] font-mono text-ink/60 uppercase select-none">
                <span>Doble clic para alterar cinta en pausa</span>
                <span>TuringLab v1.0</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Automaton Brain (State Graph + Active Transition Rule spreadsheet) (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* SVG Interactive Node Automaton diagram */}
            <div className="w-full">
              <StateGraph
                config={activeConfig}
                currentState={runtimeState.currentState}
                lastRuleId={runtimeState.lastRuleId}
              />
            </div>

            {/* Highlighted transition instruction table */}
            <div className="w-full">
              <RulesTable
                config={activeConfig}
                rules={localRules}
                currentState={runtimeState.currentState}
                currentSymbol={runtimeState.tape[runtimeState.headPosition] ?? activeConfig.blankSymbol}
                activeRuleId={runtimeState.lastRuleId}
                onAddRule={handleAddCustomRule}
                onDeleteRule={handleDeleteRule}
              />
            </div>

          </div>

        </div>

      </main>

      {/* Corporate Simple Academic Footer */}
      <footer className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-ink uppercase tracking-wider font-semibold select-none">
        <div>
          <p className="font-serif italic text-sm font-bold text-ink lowercase first-letter:uppercase">© 2026</p>
          <p className="text-[10px] text-ink/60 mt-0.5 normal-case font-mono">Basado en el diseño determinista de Turing.</p>
        </div>
        <div className="flex gap-4 items-center justify-center sm:justify-start font-mono text-[10px]">
          <span className="flex items-center gap-1 border border-line px-2 py-0.5 bg-white">
            <Scale className="w-3.5 h-3.5" /> Lizeth Victoria - Tatiana Millan
          </span>
          <span className="w-px h-3 bg-line"></span>
          <span>INGENIERÍA DE SISTEMAS</span>
        </div>
      </footer>

      {/* Dynamic Results Overlay Modal (Estilo Coqueto con Tonos Morados) */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C143F]/75 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-gradient-to-br from-[#FFF5F8] to-[#F3EBFA] border-4 border-[#8D36AC] p-6 md:p-8 shadow-2xl transition-transform transform scale-100 flex flex-col gap-4 select-none text-ink">
            
            {/* Absolute close button in top corner */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button 
                onClick={() => setShowResultModal(false)}
                className="w-7 h-7 flex items-center justify-center border border-line bg-white hover:bg-[#CEB7DF] text-ink text-sm font-bold transition-all duration-150 rounded-none cursor-pointer"
                title="Cerrar modal e inspeccionar"
              >
                ✕
              </button>
            </div>

            <div className="absolute -top-3 -left-3 bg-[#8D36AC] text-white p-2.5 border border-line flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-spin" />
            </div>

            {/* Content according to machine status */}
            {runtimeState.status === 'accepted' ? (
              <div className="flex flex-col gap-4 text-center items-center mt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-line bg-[#DFCAEC] text-[#8D36AC] text-[10.5px] font-bold font-mono tracking-wide uppercase">
                  <Heart className="w-3.5 h-3.5 fill-accent animate-pulse" />
                  CÁLCULO RESUELTO
                </div>

                <div className="p-4 bg-[#8D36AC] text-white rounded-full border-2 border-line shadow-lg relative">
                  <Award className="w-12 h-12" strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 bg-[#FFF5F8] text-[#8D36AC] text-[9px] font-bold px-1.5 py-0.5 border border-line rounded-none uppercase font-mono animate-pulse">¡ÉXITO!</span>
                </div>

                <h3 className="font-serif font-black italic text-2xl text-[#2C143F] tracking-tight">
                  ¡Entrada Aceptada con Éxito! ✨
                </h3>

                <p className="font-sans text-xs md:text-sm text-ink/80 max-w-md leading-relaxed">
                  La cinta de memoria es <span className="font-bold underline text-[#8D36AC]">formalmente válida</span>. La máquina de Turing determinista recorrió la secuencia de forma correcta satisfaciendo todas las transiciones.
                </p>

                <div className="w-full bg-white border border-[#CEB7DF] p-3.5 font-mono text-[10.5px] grid grid-cols-2 gap-3.5 text-left">
                  <div>
                    <span className="block text-ink/50 text-[9px] uppercase font-bold">Estado Final</span>
                    <span className="font-black text-xs text-[#8D36AC]">{runtimeState.currentState}</span>
                  </div>
                  <div>
                    <span className="block text-ink/50 text-[9px] uppercase font-bold">Pasos Computados</span>
                    <span className="font-black text-xs text-[#8D36AC]">{runtimeState.stepCount} pasos ejecutados</span>
                  </div>
                  <div className="col-span-2 border-t border-dashed border-[#CEB7DF] pt-2">
                    <span className="block text-ink/50 text-[9px] uppercase font-bold">Último Símbolo en Cabezal</span>
                    <span className="font-black text-xs text-ink/90 font-mono">"{runtimeState.tape[runtimeState.headPosition] ?? activeConfig.blankSymbol}" en posición [{runtimeState.headPosition}]</span>
                  </div>
                </div>

                <p className="text-[10px] text-[#8D36AC]/80 italic">Puedes cerrar esta ventana de éxito en la esquina para inspeccionar la cinta, el historial o revisar el recorrido del grafo en el fondo.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-center items-center mt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-line bg-red-100 text-red-600 text-[10.5px] font-bold font-mono tracking-wide uppercase">
                  ✕ CATASTRO ALGORÍTMICO
                </div>

                <div className="p-4 bg-red-500 text-white rounded-full border-2 border-line shadow-lg">
                  <X className="w-12 h-12" strokeWidth={3} />
                </div>

                <h3 className="font-serif font-black italic text-2xl text-red-900 tracking-tight">
                  Entrada de Cinta Rechazada 🥀
                </h3>

                <div className="font-sans text-xs text-red-950 bg-red-50 border border-red-200 p-3 max-w-md leading-relaxed font-mono">
                  {runtimeState.errorMsg || 'La máquina de Turing detuvo su ejecución debido a la ausencia de reglas válidas para avanzar en este estado o por ingresar a un estado de descarte no autorizado.'}
                </div>

                <div className="w-full bg-white border border-red-200 p-3.5 font-mono text-[10.5px] grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="block text-red-900/60 text-[9px] uppercase font-bold">Estado de Fallo</span>
                    <span className="font-black text-xs text-red-700">{runtimeState.currentState}</span>
                  </div>
                  <div>
                    <span className="block text-red-900/60 text-[9px] uppercase font-bold">Pasos Computados</span>
                    <span className="font-black text-xs text-red-700">{runtimeState.stepCount} operaciones</span>
                  </div>
                </div>

                <p className="text-[10px] text-red-700/80 italic">¿Prefieres inspeccionar la cinta actual de memoria donde ocurrió el descarte? Cierra el popup para examinar y editar.</p>
              </div>
            )}

            {/* Footer buttons for direct action inside the modal */}
            <div className="mt-2 pt-3 border-t border-line/20 flex flex-col sm:flex-row gap-3 w-full justify-between">
              <button
                onClick={() => {
                  setShowResultModal(false);
                }}
                className="flex-1 py-2 px-4 border border-line bg-white hover:bg-[#CEB7DF] text-ink font-mono font-black text-xs uppercase cursor-pointer text-center transition-colors"
              >
                Cerrar e Inspeccionar Cinta
              </button>
              <button
                onClick={() => {
                  handleReset();
                  setShowResultModal(false);
                }}
                className="flex-1 py-2 px-4 border border-line bg-[#8D36AC] hover:bg-[#732B8C] text-white font-mono font-black text-xs uppercase cursor-pointer text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Máquina</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
