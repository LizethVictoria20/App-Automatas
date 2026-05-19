import type { TMConfig } from "../types";

import { binaryIncrement } from "./binaryIncrement";
import { palindrome } from "./palindrome";
import { unaryAddition } from "./unaryAddition";
import { repeat01 } from "./repeat01";
import { copyOnes } from "./copyOnes";
import { divisibleBy3Binary } from "./divisibleBy3Binary";
import { divisibleBy3Base10 } from "./divisibleBy3Base10";
import { threeEqualLength } from "./threeEqualLength";

export const EXAMPLES: Record<string, TMConfig> = {
  binaryIncrement,
  palindrome,
  unaryAddition,
  repeat01,
  copyOnes,
  divisibleBy3Binary,
  divisibleBy3Base10,
  threeEqualLength,
};
