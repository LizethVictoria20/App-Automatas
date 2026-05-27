import type { TMConfig } from "../types";

import { binaryIncrement } from "./binaryIncrement";
import { palindrome } from "./palindrome";
import { palindromeGeneral } from "./palindromeGeneral";
import { unaryAddition } from "./unaryAddition";
import { repeat01 } from "./repeat01";
import { copyOnes } from "./copyOnes";
import { divisibleBy3Binary } from "./divisibleBy3Binary";
import { divisibleBy3Base10 } from "./divisibleBy3Base10";
import { threeEqualLength } from "./threeEqualLength";
import { equalStrings } from "./equalStrings";
import { busyBeaver3 } from "./busyBeaver3";
import { busyBeaver4 } from "./busyBeaver4";
import { powersOfTwo } from "./powersOfTwo";
import { multipliedLengths } from "./multipliedLengths";
import { binaryAddition } from "./binaryAddition";
import { unaryMultiplication } from "./unaryMultiplication";
import { binaryMultiplication } from "./binaryMultiplication";

export const EXAMPLES: Record<string, TMConfig> = {
  binaryIncrement,
  palindrome,
  palindromeGeneral,
  unaryAddition,
  repeat01,
  copyOnes,
  divisibleBy3Binary,
  divisibleBy3Base10,
  threeEqualLength,
  equalStrings,
  busyBeaver3,
  busyBeaver4,
  powersOfTwo,
  multipliedLengths,
  binaryAddition,
  unaryMultiplication,
  binaryMultiplication,
};
