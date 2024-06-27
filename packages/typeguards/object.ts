export const isObject = (arg: unknown): arg is Record<string, unknown> =>
  typeof arg === "object" && arg !== null;
