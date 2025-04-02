import { styled } from "./styled";
import { cn } from "./utils";

// Export styled, cn, and all types
export { styled, cn };
export * from "./types";
export type { GetProps, GetRef } from "./types";

// For backward compatibility
export default styled;
