/** Keeps long month-by-month series light enough to render smoothly. */
export function sampleSeries(values: number[], maxPoints = 72): number[] {
  if (values.length <= maxPoints) return values;
  const step = Math.ceil(values.length / maxPoints);
  const out = values.filter((_, index) => index % step === 0);
  const last = values[values.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}
