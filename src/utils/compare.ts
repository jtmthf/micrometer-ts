import { isComparable, compareTo } from './comparable';
import { toString } from './to-string';

export function compare<T>(
  x: T | undefined | null,
  y: T | undefined | null,
): number {
  if (x === undefined && y === undefined) return 0;

  if (x === undefined) return 1;

  if (y === undefined) return -1;

  if (isComparable(x)) {
    return x[compareTo](y);
  }

  const xString = toString(x);
  const yString = toString(y);

  if (xString < yString) return -1;

  if (xString > yString) return 1;

  return 0;
}
