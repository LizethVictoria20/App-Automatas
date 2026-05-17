import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the number of possible Turing machines with n states and k symbols.
 * Formula: (2k(n+1))^(nk)
 * 
 * Where:
 * - n = number of non-halt states
 * - k = number of symbols
 * - Each instruction writes a symbol, moves (L/R = 2 options), and goes to a state (n+1 states including halt)
 * - There is one instruction per combination of non-halt state & symbol
 * - Total instructions = nk
 * - Possible transitions per instruction = 2k(n+1)
 * 
 * @param n Number of states (excluding halt state)
 * @param k Number of symbols
 * @returns Number of possible Turing machines
 */
export function calculateTuringMachineCount(n: number, k: number): string {
  if (n <= 0 || k <= 0) return "0";
  
  // For large numbers, return scientific notation or BigInt representation
  // Since JavaScript can't handle arbitrarily large numbers accurately,
  // we return the result as a string with BigInt for precision
  try {
    const base = BigInt(2) * BigInt(k) * BigInt(n + 1);
    const exponent = BigInt(n) * BigInt(k);
    
    let result = BigInt(1);
    for (let i = BigInt(0); i < exponent; i++) {
      result = result * base;
    }
    
    return result.toString();
  } catch (e) {
    return "Número demasiado grande";
  }
}

/**
 * Get a human-readable approximation of a large number
 */
export function formatLargeNumber(numStr: string): string {
  const num = BigInt(numStr);
  const length = numStr.length;
  
  if (length <= 15) {
    return num.toLocaleString();
  }
  
  // Return in scientific notation style
  const first = numStr.substring(0, 6);
  return `${first.substring(0, 1)}.${first.substring(1)} × 10^${length - 1}`;
}
