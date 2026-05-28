import React, { useState } from 'react';
import { TuringMachineConfig, TransitionRule, Direction } from '../types';
import { Plus, Trash2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface RulesTableProps {
  config: TuringMachineConfig;
  rules: TransitionRule[];
  currentState: string;
  currentSymbol: string;
  activeRuleId?: string;
  onAddRule: (rule: Omit<TransitionRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;
}

export const RulesTable: React.FC<RulesTableProps> = ({
  config,
  rules,
  currentState,
  currentSymbol,
  activeRuleId,
  onAddRule,
  onDeleteRule,
}) => {
  // Add rule state form
  const [fromState, setFromState] = useState('');
  const [readSym, setReadSym] = useState('');
  const [writeSym, setWriteSym] = useState('');
  const [dir, setDir] = useState<Direction>('R');
  const [toState, setToState] = useState('');
  const [validationError, setValidationError] = useState('');

  // Auto-identify the active row from running simulation
  const computedActiveRule = rules.find(
    (r) => r.fromState === currentState && r.readSymbol === currentSymbol
  );

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedFrom = fromState.trim();
    const trimmedRead = readSym.trim() === '' ? config.blankSymbol : readSym.trim();
    const trimmedWrite = writeSym.trim() === '' ? config.blankSymbol : writeSym.trim();
    const trimmedTo = toState.trim();

    if (!trimmedFrom || !trimmedTo) {
      setValidationError('Los campos "Estado de Origen" y "Estado de Destino" son obligatorios.');
      return;
    }

    if (trimmedRead.length > 2 || trimmedWrite.length > 2) {
      setValidationError('Los símbolos deben tener un máximo de 2 caracteres.');
      return;
    }

    // Guard against duplicated rules (determinism check)
    const exists = rules.some(
      (r) => r.fromState === trimmedFrom && r.readSymbol === trimmedRead
    );
    if (exists) {
      setValidationError(`Ya existe una regla para el estado '${trimmedFrom}' leyendo '${trimmedRead}'. Modifícala o elimínala primero.`);
      return;
    }

    onAddRule({
      fromState: trimmedFrom,
      readSymbol: trimmedRead,
      writeSymbol: trimmedWrite,
      direction: dir,
      toState: trimmedTo,
    });

    // Reset Form
    setFromState('');
    setReadSym('');
    setWriteSym('');
    setToState('');
  };

  return (
    <div className="bg-white border border-line p-5 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <h3 className="font-serif font-bold italic text-ink text-base flex items-center gap-2">
          Reglas de Transición
        </h3>
        {config.generateRulesForAlphabet && (
          <span className="text-[9px] font-mono font-bold bg-[#DFCAEC] border border-line text-ink px-2 py-0.5 uppercase">
            Autogeneración Activa
          </span>
        )}
      </div>

      <p className="text-[11px] text-ink/75 mb-4 font-sans leading-relaxed">
        Instrucciones de la máquina. La celda sombreada en naranja representa la regla de control activa.
      </p>

      {/* Rules view section */}
      <div className="flex-1 overflow-y-auto max-h-[350px] border border-line mb-4 scrollbar-thin">
        <table className="w-full text-left font-sans text-[11px] border-collapse">
          <thead className="bg-[#DFCAEC] border-b border-line text-ink font-serif font-bold italic sticky top-0 uppercase text-[10px] tracking-wide z-10 select-none">
            <tr>
              <th className="py-2 px-3 border-r border-line/45">Estado</th>
              <th className="py-2 px-3 border-r border-line/45">Lee</th>
              <th className="py-2 px-1 text-center border-r border-line/45">→</th>
              <th className="py-2 px-3 border-r border-line/45">Escribe</th>
              <th className="py-2 px-3 text-center border-r border-line/45">Mueve</th>
              <th className="py-2 px-3 border-r border-line/45">Sgte. Estado</th>
              <th className="py-2 px-3 text-right">Borrar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/30 font-mono">
            {rules.map((rule) => {
              const worksCurrent =
                computedActiveRule && computedActiveRule.id === rule.id;

              return (
                <tr
                  key={rule.id}
                  className={`transition-colors duration-150 ${
                    worksCurrent
                      ? 'bg-accent/25 font-bold text-ink border-y-2 border-accent table-row'
                      : 'hover:bg-neutral-50 text-ink/90'
                  }`}
                >
                  <td className="py-2 px-3 border-r border-line/20">
                    <span
                      className={`px-1.5 py-0.5 border text-[10px] font-mono tracking-tight ${
                        worksCurrent ? 'bg-accent text-white border-line' : 'bg-white border-line text-ink'
                      }`}
                    >
                      {rule.fromState}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-bold border-r border-line/20">
                    "{rule.readSymbol === config.blankSymbol ? config.blankSymbol : rule.readSymbol}"
                  </td>
                  <td className="py-2 px-1 text-center text-ink/40 border-r border-line/20">→</td>
                  <td className="py-2 px-3 font-bold text-ink border-r border-line/20">
                    "{rule.writeSymbol === config.blankSymbol ? config.blankSymbol : rule.writeSymbol}"
                  </td>
                  <td className="py-2 px-3 text-center border-r border-line/20">
                    <span
                      className="px-1.5 py-0.5 border border-line text-[9px] font-bold uppercase bg-[#DFCAEC] text-ink"
                    >
                      {rule.direction === 'L' ? 'Izquierda (L)' : rule.direction === 'R' ? 'Derecha (R)' : 'Inmóvil (N)'}
                    </span>
                  </td>
                  <td className="py-2 px-3 border-r border-line/20">
                    <span
                      className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                        config.acceptStates.includes(rule.toState)
                          ? 'bg-white border-accent text-accent'
                          : config.rejectStates.includes(rule.toState)
                          ? 'bg-white border-line text-ink/60'
                          : worksCurrent
                          ? 'bg-accent text-white border-line'
                          : 'bg-white border-line text-ink'
                      }`}
                    >
                      {rule.toState}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      disabled={!!config.generateRulesForAlphabet}
                      className="text-ink/30 hover:text-accent disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {rules.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-ink/60 font-mono text-[10px]">
                  No hay instrucciones registradas. Modifica el programa o añade una regla abajo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual transition adder */}
      <div className="bg-neutral-50 p-4 border border-line">
        <h4 className="font-serif font-bold italic text-xs text-ink mb-2.5 flex items-center gap-1 uppercase">
          <Plus className="w-4 h-4" />
          Añadir Transición
        </h4>

        {config.generateRulesForAlphabet ? (
          <div className="text-[10px] font-mono text-ink/70 bg-[#DFCAEC]/50 border border-line p-2.5 leading-normal">
            Este ejercicio utiliza autogeneración determinista de transiciones adaptando el alfabeto y la cinta. Modifica las celdas directamente para modelar.
          </div>
        ) : (
          <form onSubmit={handleAddRuleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              
              {/* Origin state */}
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-ink/75 mb-1">Origen</label>
                <input
                  type="text"
                  placeholder="Ej. q0"
                  value={fromState}
                  onChange={(e) => setFromState(e.target.value)}
                  className="w-full px-2 py-1 border border-line text-xs outline-none bg-white text-ink font-mono"
                />
              </div>

              {/* Read symbol */}
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-ink/75 mb-1">Lee</label>
                <input
                  type="text"
                  placeholder="1, 0, _"
                  value={readSym}
                  onChange={(e) => setReadSym(e.target.value)}
                  className="w-full px-2 py-1 border border-line text-xs outline-none bg-white text-ink font-mono text-center"
                />
              </div>

              {/* Write Symbol */}
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-ink/75 mb-1">Escribe</label>
                <input
                  type="text"
                  placeholder="1, 0, _"
                  value={writeSym}
                  onChange={(e) => setWriteSym(e.target.value)}
                  className="w-full px-2 py-1 border border-line text-xs outline-none bg-white text-ink font-mono text-center"
                />
              </div>

              {/* Direction selector */}
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-ink/75 mb-1">Mueve</label>
                <select
                  value={dir}
                  onChange={(e) => setDir(e.target.value as Direction)}
                  className="w-full px-1 py-1 border border-line text-xs outline-none bg-white font-mono text-ink cursor-pointer"
                >
                  <option value="R">Derecha (R)</option>
                  <option value="L">Izquierda (L)</option>
                  <option value="N">Inmóvil (N)</option>
                </select>
              </div>

              {/* Destination/Next state */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[9px] font-mono font-bold uppercase text-ink/75 mb-1">Destino</label>
                <input
                  type="text"
                  placeholder="Ej. q1"
                  value={toState}
                  onChange={(e) => setToState(e.target.value)}
                  className="w-full px-2 py-1 border border-line text-xs outline-none bg-white text-ink font-mono"
                />
              </div>

            </div>

            {validationError && (
              <div className="text-[10px] font-mono text-white bg-accent border border-line p-2 flex items-center gap-1.5 animate-fade-in uppercase">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
               type="submit"
               className="w-full py-1.5 border border-line text-xs font-mono font-bold uppercase bg-[#DFCAEC] hover:bg-[#CEB7DF] text-ink transition-colors cursor-pointer"
             >
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Registrar Nueva Regla
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
