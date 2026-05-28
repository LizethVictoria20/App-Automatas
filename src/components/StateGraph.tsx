import React, { useMemo } from 'react';
import { TuringMachineConfig, TransitionRule } from '../types';

interface StateGraphProps {
  config: TuringMachineConfig;
  currentState: string;
  lastRuleId?: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  labels: string[];
}

export const StateGraph: React.FC<StateGraphProps> = ({ config, currentState, lastRuleId }) => {
  // Extract all unique states from the machine's rules and configs
  const states = useMemo(() => {
    const list = new Set<string>();
    list.add(config.initialState);
    config.acceptStates.forEach(s => list.add(s));
    config.rejectStates.forEach(s => list.add(s));
    
    // Add states found in rules
    let activeRules = config.rules;
    if (config.generateRulesForAlphabet) {
      // For general palindrome, simulate standard alphabet to draw a neat reference graph
      const dummyAlphabet = ['a', 'b', '_'];
      activeRules = config.generateRulesForAlphabet(dummyAlphabet, config.blankSymbol);
    }

    activeRules.forEach(r => {
      list.add(r.fromState);
      list.add(r.toState);
    });

    return Array.from(list);
  }, [config]);

  // Generate perfect coordinates for the node layout using structured circular positioning
  const nodes = useMemo<Node[]>(() => {
    const total = states.length;
    const width = 360;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    return states.map((state, index) => {
      // Better layouts: we can separate known accept/reject states to the bottom or corners
      let x = centerX;
      let y = centerY;
      
      if (total === 1) {
        x = centerX;
        y = centerY;
      } else if (state === 'q_accept') {
        x = centerX - 100;
        y = height - 45;
      } else if (state === 'q_reject') {
        x = centerX + 100;
        y = height - 45;
      } else if (state === config.initialState) {
        x = 45;
        y = centerY - 20;
      } else {
        const angle = (index / (total - (config.acceptStates.includes('q_accept') ? 1 : 0))) * 2 * Math.PI;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle) - 15;
      }

      // Constrain inside bounds
      x = Math.max(30, Math.min(width - 30, x));
      y = Math.max(30, Math.min(height - 35, y));

      return {
        id: state,
        label: state,
        x,
        y
      };
    });
  }, [states, config]);

  // Group duplicate edges to prevent visual clutter
  const edges = useMemo<Edge[]>(() => {
    let activeRules = config.rules;
    if (config.generateRulesForAlphabet) {
      const dummyAlphabet = ['a', 'b', '_'];
      activeRules = config.generateRulesForAlphabet(dummyAlphabet, config.blankSymbol);
    }

    const map = new Map<string, string[]>();

    activeRules.forEach(r => {
      const key = `${r.fromState}->${r.toState}`;
      const label = `${r.readSymbol}→${r.writeSymbol},${r.direction}`;
      
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(label);
    });

    const list: Edge[] = [];
    map.forEach((labels, key) => {
      const [from, to] = key.split('->');
      list.push({ from, to, labels });
    });

    return list;
  }, [config]);

  // Find node by state name helper
  const findNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="bg-white border border-line p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 id="graph-title" className="font-serif font-bold italic text-ink text-base flex items-center gap-2">
          Diagrama de Estados
        </h3>
        <span className="font-mono text-[9px] bg-[#DFCAEC] border border-line text-ink px-2 py-0.5 select-none uppercase font-bold">
          {states.length} Estados
        </span>
      </div>

      <p className="text-[11px] text-ink/75 mb-4 font-sans leading-relaxed">
        Visualización de transiciones y flujos. El círculo ilustrado en naranja completo representa el estado actual de cómputo.
      </p>

      {/* SVG Canvas with high DPI scaling */}
      <div className="relative flex-1 min-h-[300px] border border-line bg-[#F1E4FA] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 360 300"
          className="w-full h-full max-h-[340px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arrow markers definition for lines */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C143F" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8D36AC" />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw Transitions (Edges) */}
          {edges.map((edge, idx) => {
            const startNode = findNode(edge.from);
            const endNode = findNode(edge.to);

            if (!startNode || !endNode) return null;

            const isSelfLoop = edge.from === edge.to;
            const isActiveTransition = currentState === edge.from;

            // Draw line or curved path
            if (isSelfLoop) {
              const x = startNode.x;
              const y = startNode.y - 18;
              
              // Squeeze label text if too long
              const joinedLabel = edge.labels.slice(0, 2).join(' | ') + (edge.labels.length > 2 ? '...' : '');

              return (
                <g key={`loop-${idx}`} className="opacity-90 transition-all duration-150">
                  <path
                    d={`M ${x - 5} ${y + 3} C ${x - 22} ${y - 32}, ${x + 22} ${y - 32}, ${x + 5} ${y + 3}`}
                    fill="none"
                    stroke={isActiveTransition ? '#8D36AC' : '#2C143F'}
                    strokeWidth={isActiveTransition ? 2 : 1}
                    markerEnd={`url(#${isActiveTransition ? 'arrow-active' : 'arrow'})`}
                  />
                  <text
                    x={x}
                    y={y - 32}
                    className="font-mono text-[9px] fill-ink font-bold"
                    textAnchor="middle"
                  >
                    {joinedLabel}
                  </text>
                </g>
              );
            } else {
              // Draw line between nodes
              const dx = endNode.x - startNode.x;
              const dy = endNode.y - startNode.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              // Curve slightly so bidirectional lines don't overlay
              const mx = (startNode.x + endNode.x) / 2;
              const my = (startNode.y + endNode.y) / 2;
              const qx = mx - dy * 0.12; 
              const qy = my + dx * 0.12;

              const labelOffsetDist = 12;
              const lx = mx - dy * (labelOffsetDist / dist);
              const ly = my + dx * (labelOffsetDist / dist);

              const joinedLabel = edge.labels.slice(0, 1).join(', ') + (edge.labels.length > 1 ? '...' : '');

              return (
                <g key={`edge-${idx}`} className="transition-all duration-150">
                  <path
                    d={`M ${startNode.x} ${startNode.y} Q ${qx} ${qy} ${endNode.x} ${endNode.y}`}
                    fill="none"
                    stroke={isActiveTransition ? '#8D36AC' : '#2C143F'}
                    strokeWidth={isActiveTransition ? 1.8 : 1}
                    markerEnd={`url(#${isActiveTransition ? 'arrow-active' : 'arrow'})`}
                  />
                  <rect
                    x={lx - 15}
                    y={ly - 6}
                    width="30"
                    height="11"
                    fill="#FFF"
                    stroke="#2C143F"
                    strokeWidth="0.5"
                    className="opacity-95"
                  />
                  <text
                    x={lx}
                    y={ly + 2}
                    className="font-mono text-[8px] fill-ink font-bold"
                    textAnchor="middle"
                  >
                    {joinedLabel}
                  </text>
                </g>
              );
            }
          })}

          {/* Draw States (Nodes) */}
          {nodes.map((node) => {
            const isCurrent = node.id === currentState;
            const isInitial = node.id === config.initialState;
            const isAccept = config.acceptStates.includes(node.id);
            const isReject = config.rejectStates.includes(node.id);

            let borderTheme = 'stroke-line fill-white text-ink';
            if (isCurrent) {
              borderTheme = 'stroke-line fill-accent text-white font-bold';
            } else if (isAccept) {
              borderTheme = 'stroke-line fill-white text-ink';
            } else if (isReject) {
              borderTheme = 'stroke-line fill-[#DFCAEC] text-ink';
            } else if (isInitial) {
              borderTheme = 'stroke-line fill-white text-ink';
            }

            return (
              <g
                key={`node-${node.id}`}
                className="cursor-default select-none transition-all duration-150"
                transform={`translate(${node.x},${node.y})`}
              >
                {/* Visual ripple pulse for active state */}
                {isCurrent && (
                  <circle
                    r="20"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="3"
                    className="animate-ping opacity-25"
                  />
                )}
                
                {/* Main state circle */}
                <circle
                  r={isCurrent ? "17" : "15"}
                  className={`stroke-[1.5] transition-all duration-150 ${borderTheme}`}
                />

                {/* Sub-border for accept states (double circle pattern) */}
                {isAccept && (
                  <circle
                    r="12"
                    fill="none"
                    className="stroke-line stroke-[1]"
                  />
                )}

                {/* State Name Label */}
                <text
                  className="font-mono text-[9px] dy-[3px] text-center pointer-events-none fill-current font-bold"
                  textAnchor="middle"
                  y="3"
                >
                  {node.label}
                </text>

                {/* Start Arrow Tag */}
                {isInitial && (
                  <g transform="translate(-25, 0)">
                    <path
                      d="M -5 0 L 5 0"
                      stroke="#2C143F"
                      strokeWidth="1.5"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      y="-4"
                      x="-3"
                      className="font-mono text-[7px] font-bold fill-ink"
                      textAnchor="middle"
                    >
                      INICIO
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-2 items-center justify-center bg-white/95 py-1 px-2 border border-line text-[8.5px] font-mono text-ink">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 border border-line bg-white"></span> Inicio
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-accent"></span> Activo ({currentState})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 border-2 border-line bg-white"></span> Acepta (Doble)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#DFCAEC] border border-line"></span> Rechaza
          </span>
        </div>
      </div>
    </div>
  );
};
