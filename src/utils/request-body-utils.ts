export const withDefined = <T extends Record<string, unknown>>(
  base: T,
  optional: Record<string, unknown>,
): T & Record<string, unknown> => {
  const result: Record<string, unknown> = { ...base };
  Object.entries(optional).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
  });
  return result as T & Record<string, unknown>;
};
