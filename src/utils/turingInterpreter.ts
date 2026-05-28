import { TuringMachineConfig, RuntimeState, TransitionRule, Direction } from '../types';

/**
 * Parses user input string into a sparse tape record. For blank spaces,
 * it maps to the specified blank symbol.
 */
export function initializeState(config: TuringMachineConfig, customInput?: string): RuntimeState {
  const tapeInput = customInput !== undefined ? customInput : config.initialInput;
  const tape: Record<number, string> = {};
  
  // Fill initial tape cells
  for (let i = 0; i < tapeInput.length; i++) {
    tape[i] = tapeInput[i] || config.blankSymbol;
  }

  return {
    tape,
    headPosition: 0,
    currentState: config.initialState,
    stepCount: 0,
    status: 'idle',
    lastRuleId: undefined,
    lastDirection: undefined,
  };
}

/**
 * Returns all unique tape symbol values currently on the tape.
 */
export function getAlphabetFromTape(tape: Record<number, string>, blankSymbol: string): string[] {
  const symbols = new Set<string>();
  Object.values(tape).forEach(val => {
    if (val && val !== blankSymbol) {
      symbols.add(val);
    }
  });
  // Always ensure we have some basic active elements plus blank
  symbols.add(blankSymbol);
  return Array.from(symbols);
}

/**
 * Steps the Turing Machine forward by exactly one instruction.
 */
export function stepMachine(state: RuntimeState, config: TuringMachineConfig): RuntimeState {
  // If we already finished, do nothing
  if (['accepted', 'rejected', 'halted', 'error'].includes(state.status)) {
    return state;
  }

  // Get active rules list
  let rules = config.rules;

  // Handles dynamic state rule sets like palindromeGeneral
  if (config.generateRulesForAlphabet) {
    const currentAlphabet = getAlphabetFromTape(state.tape, config.blankSymbol);
    rules = config.generateRulesForAlphabet(currentAlphabet, config.blankSymbol);
  }

  const currentSymbol = state.tape[state.headPosition] ?? config.blankSymbol;
  const currentStateName = state.currentState;

  // Search matching transition rule
  const rule = rules.find(
    r => r.fromState === currentStateName && r.readSymbol === currentSymbol
  );

  const nextTape = { ...state.tape };

  if (rule) {
    // Write new symbol to tape
    nextTape[state.headPosition] = rule.writeSymbol;

    // Head movement
    let nextHeadPos = state.headPosition;
    if (rule.direction === 'L') {
      nextHeadPos -= 1;
    } else if (rule.direction === 'R') {
      nextHeadPos += 1;
    }

    // Determine machine state
    let nextStatus: RuntimeState['status'] = 'running';
    if (config.acceptStates.includes(rule.toState)) {
      nextStatus = 'accepted';
    } else if (config.rejectStates.includes(rule.toState)) {
      nextStatus = 'rejected';
    } else if (rule.toState === 'q_halt' || rule.toState === 'q_halted') {
      nextStatus = 'halted';
    }

    return {
      tape: nextTape,
      headPosition: nextHeadPos,
      currentState: rule.toState,
      stepCount: state.stepCount + 1,
      status: nextStatus,
      lastRuleId: rule.id,
      lastDirection: rule.direction,
    };
  } else {
    // No matching transition. Determine if we are on a final accepting/rejecting state
    if (config.acceptStates.includes(currentStateName)) {
      return {
        ...state,
        status: 'accepted',
        lastDirection: 'N',
      };
    } else if (config.rejectStates.includes(currentStateName)) {
      return {
        ...state,
        status: 'rejected',
        lastDirection: 'N',
      };
    } else {
      // Unspecified transition triggers HALT / REJECT
      return {
        ...state,
        status: 'rejected',
        lastDirection: 'N',
        errorMsg: `Transición no definida en estado '${currentStateName}' para el símbolo '${currentSymbol}'. La máquina rechaza la entrada.`,
      };
    }
  }
}

/**
 * Calculates current visible tape boundaries so rendering displays a beautiful infinite sliding track.
 */
export function getTapeViewportBounds(
  tape: Record<number, string>,
  headPosition: number,
  padding: number = 7
): { min: number; max: number } {
  const activeIndices = Object.keys(tape).map(Number);
  
  if (activeIndices.length === 0) {
    return {
      min: headPosition - padding,
      max: headPosition + padding,
    };
  }

  const minIndex = Math.min(...activeIndices);
  const maxIndex = Math.max(...activeIndices);

  // Viewport should safely encase the head and minimum/maximum entered index with smooth margins
  return {
    min: Math.min(minIndex - 1, headPosition - padding),
    max: Math.max(maxIndex + 1, headPosition + padding),
  };
}
