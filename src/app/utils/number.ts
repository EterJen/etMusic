export function limitNumberInRange(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}



export function calcPresent(val: number | null, min: number, max: number): number {
  if (val === null) {
    return 0;
  } else {
    return (val - min) / (max - min) * 100;
  }
}
