export const compareTo = Symbol('CompareTo');

export interface Comparable<T> {
  [compareTo](other: T): number;
}

export function isComparable<T = any>(value: any): value is Comparable<T> {
  return value && value[compareTo];
}
