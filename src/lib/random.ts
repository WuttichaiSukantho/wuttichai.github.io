export function secureRandom(): number {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);

  const value = values[0];
  return value === undefined ? 0 : value / 0x100000000;
}
