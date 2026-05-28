import React, { useState, useEffect, useRef } from 'react';
import { TapeCell } from '../types';
import { getTapeViewportBounds } from '../utils/turingInterpreter';
import { ArrowDown, ArrowLeft, ArrowRight, Square } from 'lucide-react';

interface TapeVisualizerProps {
  tape: Record<number, string>;
  headPosition: number;
  blankSymbol: string;
  onCellChange: (index: number, newSymbol: string) => void;
  status: string;
  lastDirection?: 'L' | 'R' | 'N';
}

export const TapeVisualizer: React.FC<TapeVisualizerProps> = ({
  tape,
  headPosition,
  blankSymbol,
  onCellChange,
  status,
  lastDirection,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [padding, setPadding] = useState(8);
  const tapeContainerRef = useRef<HTMLDivElement>(null);

  // Dynamically update viewport cell padding as container resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPadding(4); // Fewer cells visible on mobile
      } else if (window.innerWidth < 1024) {
        setPadding(6);
      } else {
        setPadding(8);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute boundaries for sliding tape viewport
  const { min, max } = getTapeViewportBounds(tape, headPosition, padding);

  const cells: TapeCell[] = [];
  for (let i = min; i <= max; i++) {
    cells.push({
      index: i,
      symbol: tape[i] !== undefined ? tape[i] : blankSymbol,
      isRead: i === headPosition,
    });
  }

  // Handle cell edit save
  const handleSaveCell = (index: number) => {
    // Treat empty string or spaces as the blank symbol
    let val = editValue.trim();
    if (val === '') val = blankSymbol;
    // Limit to single character to keep things mathematically consistent (unless user has special symbols)
    const sanitized = val.slice(0, 3); // Allow small strings for multi-char simulation if requested, usually 1 char
    onCellChange(index, sanitized);
    setEditingIndex(null);
  };

  // Auto-focus input when cell edit is triggered
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  // Keyboard controls during tape cell selection
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleSaveCell(index);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
    }
  };

  // Re-center tape container visually on the head position
  const handleCenterHead = () => {
    const activeCellEl = document.getElementById(`tape-cell-${headPosition}`);
    if (activeCellEl && tapeContainerRef.current) {
      activeCellEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  // Center head automatically when head moves or simulation finishes
  useEffect(() => {
    setTimeout(() => {
      const activeCellEl = document.getElementById(`tape-cell-${headPosition}`);
      if (activeCellEl && tapeContainerRef.current) {
        activeCellEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }, 50);
  }, [headPosition]);

  return (
    <div className="bg-white border border-line p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-serif font-bold italic text-ink text-lg flex items-center gap-2">
            Cinta de Memoria Determinista
          </h2>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-ink/65 font-sans mt-0.5">
            Haz clic en celdas [modo idilio/pausa] para alterar los bits iniciales de cálculo.
          </p>
        </div>
        <button
          onClick={handleCenterHead}
          className="text-xs font-mono font-bold uppercase text-ink bg-bg-base hover:bg-[#DFCAEC] px-3 py-1.5 border border-line transition-all duration-150 cursor-pointer pointer-events-auto"
        >
          Cabezal a la Vista (Index: {headPosition})
        </button>
      </div>

      {/* Tape track layout */}
      <div className="relative pt-4 pb-2 px-1">
        
        {/* Dynamic Movement Direction Indicator Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border border-line bg-[#FFF6FC] p-3 mb-4 gap-2 shadow-xs transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="font-mono text-[10px] text-ink font-bold tracking-wider uppercase select-none">
              Movimiento de la Cinta (Paso Anterior):
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Left movement indicator block */}
            <div className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold border transition-all duration-300 ${
              lastDirection === 'L' 
                ? 'bg-accent/10 border-accent text-accent scale-105 shadow-xs' 
                : 'bg-white border-neutral-200 text-ink/30 opacity-40'
            }`}>
              <ArrowLeft className={`w-3.5 h-3.5 ${lastDirection === 'L' ? 'animate-bounce' : ''}`} />
              <span>IZQUIERDA (L)</span>
            </div>

            {/* Static / Idle indicator block */}
            <div className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold border transition-all duration-300 ${
              lastDirection === 'N' || lastDirection === undefined
                ? 'bg-neutral-100 border-line text-ink scale-105 shadow-xs' 
                : 'bg-white border-neutral-200 text-ink/30 opacity-40'
            }`}>
              <Square className="w-3 h-3" />
              <span>ESTÁTICO</span>
            </div>

            {/* Right movement indicator block */}
            <div className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold border transition-all duration-300 ${
              lastDirection === 'R' 
                ? 'bg-accent/10 border-accent text-accent scale-105 shadow-xs' 
                : 'bg-white border-neutral-200 text-ink/30 opacity-40'
            }`}>
              <span>DERECHA (R)</span>
              <ArrowRight className={`w-3.5 h-3.5 ${lastDirection === 'R' ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        </div>
        
        {/* Physical slider container */}
        <div 
          ref={tapeContainerRef}
          className="flex items-center overflow-x-auto gap-1 py-5 px-8 border border-line bg-[#DFCAEC] scrollbar-thin select-none justify-start md:justify-center"
        >
          {cells.map((cell) => {
            const isHead = cell.index === headPosition;
            const isEditing = editingIndex === cell.index;

            let cellBg = 'bg-white border-line text-ink hover:bg-neutral-50';
            if (isHead) {
              if (status === 'accepted') {
                cellBg = 'bg-[#FFF6FC] border-2 border-accent text-accent outline-3 outline-accent outline-offset-1 scale-105 z-10';
              } else if (status === 'rejected') {
                cellBg = 'bg-[#FFF6FC] border-2 border-accent text-accent outline-3 outline-accent outline-offset-1 scale-105 z-10';
              } else {
                cellBg = 'bg-[#FFF6FC] border-2 border-accent text-accent outline-3 outline-accent outline-offset-1 scale-105 z-10';
              }
            } else if (cell.symbol !== blankSymbol) {
              cellBg = 'bg-neutral-100 border-line text-ink font-bold';
            }

            return (
              <div
                id={`tape-cell-${cell.index}`}
                key={`cell-${cell.index}`}
                onClick={() => {
                  if (status === 'idle' || status === 'paused') {
                    setEditingIndex(cell.index);
                    setEditValue(cell.symbol === blankSymbol ? '' : cell.symbol);
                  }
                }}
                className={`relative flex-none w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center border font-mono text-base md:text-lg transition-all duration-150 cursor-pointer ${cellBg}`}
              >
                {/* Upper index tag */}
                <span className="absolute top-1 text-[8.5px] text-ink/50 font-mono tracking-tighter">
                  {cell.index === 0 ? '0_START' : cell.index}
                </span>

                {/* Arrow Pointer on Head Cell */}
                {isHead && (
                  <div className="absolute -top-[34px] flex flex-col items-center z-20">
                    <div className="flex items-center gap-0.5 bg-accent text-white border border-line px-1.5 py-0.5 shadow-sm">
                      {lastDirection === 'L' && <ArrowLeft className="w-2.5 h-2.5 animate-pulse text-white" />}
                      <span className="text-[8px] font-mono font-bold uppercase select-none tracking-tighter">
                        {lastDirection === 'L' ? 'L' : lastDirection === 'R' ? 'R' : 'LEER'}
                      </span>
                      {lastDirection === 'R' && <ArrowRight className="w-2.5 h-2.5 animate-pulse text-white" />}
                    </div>
                    <ArrowDown className="w-4 h-4 text-accent -mt-0.5 animate-bounce" strokeWidth={2.5} />
                  </div>
                )}

                {/* Edit input or standard output rendering */}
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveCell(cell.index)}
                    onKeyDown={(e) => handleKeyDown(e, cell.index)}
                    className="w-full text-center bg-transparent border-none outline-none font-mono font-bold text-lg text-ink p-0"
                    maxLength={3}
                  />
                ) : (
                  <span className="font-bold relative top-1 text-center truncate px-1 max-w-full">
                    {cell.symbol}
                  </span>
                )}

                {/* Visual marker inside empty cells */}
                {cell.symbol === blankSymbol && !isEditing && (
                  <span className="text-ink/40 font-mono text-[9px] absolute bottom-1 h-3 pointer-events-none uppercase">
                    null
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic State Alert Banner */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-ink/75">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border border-line bg-neutral-100"></span>
              Símbolo de cinta
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border border-line bg-white"></span>
              Casilla en blanco ({blankSymbol})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 border-2 border-accent bg-[#FFF6FC]"></span>
              Cabezal Lectura
            </span>
          </div>
          <span className="opacity-60 select-none">
            Riel deslizante: [{min} ... {max}]
          </span>
        </div>
      </div>
    </div>
  );
};
