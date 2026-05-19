import type { TMConfig } from "./types";

// Backwards-compatible re-export.
// The examples are now modularized under src/examples.
export { EXAMPLES } from "./examples";

// Keep TMConfig referenced so existing tooling/types remain discoverable.
export type { TMConfig };
