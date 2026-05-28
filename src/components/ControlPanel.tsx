import React, { useState } from 'react';
import { TuringMachineConfig, MachineStatus } from '../types';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Trash2, ArrowRightLeft, Zap, CheckCircle2, XCircle, Sparkles, AlertOctagon } from 'lucide-react';

interface ControlPanelProps {
  config: TuringMachineConfig;
  status: MachineStatus;
  stepCount: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onClearTape: () => void;
  onCustomInputLoad: (inputUrl: string) => void;
  canBackward: boolean;
  canForward: boolean;
  currentState: string;
  errorMsg?: string;
  instantRun: boolean;
  onInstantRunChange: (val: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  status,
  stepCount,
  speed,
  onSpeedChange,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onClearTape,
  onCustomInputLoad,
  canBackward,
  canForward,
  currentState,
  errorMsg,
  instantRun,
  onInstantRunChange,
}) => {
  const [inputText, setInputText] = useState(config.initialInput);

  // Set the default input value if the exercise changes
  React.useEffect(() => {
    setInputText(config.initialInput);
  }, [config]);

  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomInputLoad(inputText);
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'accepted':
        return (
          <div className="bg-[#FAF2FC] border-4 border-accent text-ink p-5 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 shadow-md transition-all duration-300 transform scale-[1.01] relative overflow-hidden">
            {/* Romantic Sparkly Background Deco */}
            <div className="absolute top-0 right-0 p-1 opacity-20 pointer-events-none select-none">
              <Sparkles className="w-24 h-24 text-accent animate-pulse" />
            </div>
            
            <div className="p-3.5 bg-accent text-white rounded-full flex items-center justify-center shrink-0 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <span className="font-serif font-black italic text-lg tracking-tight uppercase text-accent">
                  ✨ ¡ENTRADA COMPLETADA CON ÉXITO! ✨
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase bg-accent text-white border border-line shadow-xs">
                  Aceptada en {stepCount} pasos 🎉
                </span>
              </div>
              <p className="font-serif italic font-medium text-xs md:text-sm text-ink/90 leading-relaxed max-w-3xl">
                ¡Felicidades! El autómata determinista procesó todo el alfabeto y llegó con éxito a uno de los estados finales de aceptación (<span className="font-mono font-bold text-accent bg-accent/10 px-1 py-0.2">{config.acceptStates.join(', ')}</span>). La cinta es formalmente válida de acuerdo con la gramática especificada.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-[#FFF4F4] border-4 border-[#D32F2F] text-[#420A0A] p-5 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 shadow-md transition-all duration-300 transform scale-[1.01] relative overflow-hidden">
            <div className="p-3.5 bg-[#D32F2F] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <XCircle className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <span className="font-serif font-black italic text-lg tracking-tight uppercase text-[#D32F2F]">
                  💔 ENTRADA RECHAZADA O SIN COINCIDENCIA
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase bg-[#D32F2F] text-white border border-[#420A0A] shadow-xs">
                  Rechazada en {stepCount} paso{stepCount !== 1 ? 's' : ''} ✖
                </span>
              </div>
              <div className="font-serif italic font-medium text-xs md:text-sm text-[#420A0A]/95 leading-relaxed max-w-3xl">
                {errorMsg ? (
                  <p className="p-2.5 bg-red-100/50 border border-red-200 font-mono text-[11px] leading-relaxed break-words">
                    {errorMsg}
                  </p>
                ) : (
                  <p>
                    La máquina de Turing se ha detenido o ha entrado en un estado de descarte no autorizado. Los caracteres o símbolos leídos por el cabezal no cumplen con las reglas de transición correspondientes descritas por la tabla de estados.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 'halted':
        return (
          <div className="bg-white border-2 border-line text-ink p-4 flex items-center gap-3 animate-fade-in">
            <div className="p-2 bg-ink text-white rounded-none">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold italic text-sm tracking-tight uppercase">AUTÓMATA DETENIDO (HALT)</p>
              <p className="font-mono text-[10px] text-ink/80 mt-0.5">No se encontraron más reglas ejecutables para el símbolo actual. HALT del sistema.</p>
            </div>
          </div>
        );
      case 'running':
        return (
          <div className="bg-white border border-line text-ink p-4 flex items-center gap-3 animate-fade-in">
            <span className="w-4 h-4 bg-accent animate-ping rounded-full shrink-0"></span>
            <div>
              <p className="font-serif font-bold italic text-sm tracking-tight uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" /> TRANSICIÓN ACTIVA
              </p>
              <p className="font-mono text-[10px] text-ink/80 mt-0.5">Ejecutando secuencia en tiempo real con intervalos de {speed}ms.</p>
            </div>
          </div>
        );
      case 'paused':
        return (
          <div className="bg-white border border-line text-ink p-4 flex items-center gap-3">
            <span className="w-3.5 h-3.5 bg-neutral-400 shrink-0"></span>
            <div>
              <p className="font-serif font-bold italic text-sm tracking-tight uppercase">SIMULACIÓN EN SUSPENSO</p>
              <p className="font-mono text-[10px] text-ink/80 mt-0.5">Pausado. Presione ejecutar o avance secuencialmente con el cabezal paso a paso.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-[#DFCAEC] border border-line text-ink p-4 flex items-center gap-3">
            <span className="w-3.5 h-3.5 border border-line bg-white shrink-0"></span>
            <div>
              <p className="font-serif font-bold italic text-sm tracking-tight uppercase">SISTEMA INICIALIZADO (IDLE)</p>
              <p className="font-mono text-[10px] text-ink/80 mt-0.5">Modifique la cinta de memoria y use los parámetros para calcular transiciones.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-line p-6 mb-6">
      
      {/* Simulation status ribbon */}
      <div className="mb-6">
        {getStatusIndicator()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Playback Buttons (Cols 1-5) */}
        <div className="lg:col-span-6 flex flex-wrap gap-2.5 justify-start">
          
          {/* Play/Pause toggle */}
          {status === 'running' ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-2.5 border border-line bg-accent hover:bg-opacity-80 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" /> Pausar
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={status === 'accepted' || status === 'rejected' || status === 'halted'}
              className="flex items-center gap-2 px-5 py-2.5 border border-line bg-ink hover:opacity-90 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Ejecutar
            </button>
          )}

          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={!canBackward || status === 'running'}
            title="Retroceder paso en la historia"
            className="flex items-center justify-center w-10 h-10 border border-line bg-white hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-35 transition-colors pointer-events-auto cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 pointer-events-none" />
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={!canForward || status === 'running'}
            title="Avanzar un paso"
            className="flex items-center justify-center w-10 h-10 border border-line bg-white hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-35 transition-colors pointer-events-auto cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 pointer-events-none" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Restablecer máquina a estado original"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-line bg-white hover:bg-neutral-50 text-ink font-mono font-bold text-xs uppercase tracking-wider transition-colors pointer-events-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>

          {/* Clear Tape */}
          <button
            onClick={onClearTape}
            title="Limpiar toda la cinta"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-line bg-white hover:bg-red-50 text-ink hover:text-accent font-mono font-bold text-xs uppercase tracking-wider transition-colors pointer-events-auto cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Vaciar
          </button>
        </div>

        {/* Speed Controls (Cols 6-12) */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          
          {/* Run speed slider */}
          <div className="w-full sm:flex-1">
            <div className="flex justify-between text-[11px] font-mono tracking-wide uppercase text-ink/80 mb-1.5">
              <span>Velocidad de ejecución:</span>
              <span className="font-bold text-ink">{speed}ms / paso</span>
            </div>
            <input
              type="range"
              min={30}
              max={1500}
              step={30}
              value={speed}
              disabled={instantRun || status === 'running'}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 rounded-none appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[9px] font-mono tracking-wider uppercase text-ink/50 mt-1">
              <span>Rápido (30ms)</span>
              <span>Lento (1.5s)</span>
            </div>
          </div>

          {/* Instant execute toggle */}
          <div className="flex items-center gap-2 shrink-0 border border-line p-2 bg-neutral-50">
            <input
              type="checkbox"
              id="instantRangeMode"
              checked={instantRun}
              onChange={(e) => onInstantRunChange(e.target.checked)}
              className="w-4 h-4 text-accent bg-white border-line rounded-none"
            />
            <label htmlFor="instantRangeMode" className="font-mono text-[10px] uppercase font-bold tracking-wider text-ink flex items-center gap-1 cursor-pointer select-none">
              <Zap className="w-3.5 h-3.5 text-accent fill-accent/40" />
              Instantáneo
            </label>
          </div>
        </div>

      </div>

      {/* Manual text customizer */}
      <form onSubmit={handleSubmitInput} className="mt-6 pt-5 border-t border-line flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-md w-full">
          <label className="font-serif font-bold italic text-xs text-ink block mb-1.5 uppercase">
            Cargar Entrada Alternativa:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={status === 'running'}
              placeholder="Escribe la cadena..."
              className="flex-1 px-3 py-2 border border-line text-xs font-mono bg-white text-ink outline-none"
            />
            <button
              type="submit"
              disabled={status === 'running'}
              className="px-4 py-2 bg-ink border border-line hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Cambiar Entrada
            </button>
          </div>
        </div>

        {/* Runtime Statistics Board */}
        <div className="flex items-center gap-4 bg-[#DFCAEC] p-3 border border-line text-[11px] font-mono uppercase tracking-wider text-ink select-none">
          <div className="text-center px-2">
            <span className="block text-[8.5px] text-ink/70 font-semibold">Estado Actual</span>
            <span className="font-mono text-xs font-black text-accent">{currentState}</span>
          </div>
          <div className="w-px h-6 bg-line opacity-30"></div>
          <div className="text-center px-2">
            <span className="block text-[8.5px] text-ink/70 font-semibold">Total Pasos</span>
            <span className="font-mono text-xs font-black text-ink">{stepCount}</span>
          </div>
          <div className="w-px h-6 bg-line opacity-30"></div>
          <div className="text-center px-2">
            <span className="block text-[8.5px] text-ink/70 font-semibold">Símbolo Blanco</span>
            <span className="font-mono text-xs font-black text-ink">"{config.blankSymbol}"</span>
          </div>
        </div>

      </form>
    </div>
  );
};
