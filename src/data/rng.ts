/**
 * Deterministic PRNG (mulberry32) so demo data renders identically across
 * reloads/builds.
 */
export function createRng(seed: number) {
  let a = seed >>> 0;
  return function rand(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function weightedHour(rng: () => number, hour: number): number {
  // Simulate a "typical desk worker" distribution: quiet nights, peaks during
  // working hours with a minor afternoon dip.
  let base = 0;
  if (hour >= 9 && hour <= 11) base = 0.9;
  else if (hour === 12) base = 0.45;
  else if (hour >= 13 && hour <= 17) base = 0.85;
  else if (hour >= 18 && hour <= 21) base = 0.55;
  else if (hour >= 22 || hour <= 6) base = 0.08;
  else base = 0.35;

  const jitter = (rng() - 0.5) * 0.4;
  return Math.max(0, base + jitter);
}
