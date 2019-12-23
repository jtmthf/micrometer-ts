export function toString(obj: any) {
  if (obj === null) return 'null';

  if (typeof obj === 'boolean' || typeof obj === 'number')
    return obj.toString();

  if (typeof obj === 'string') return obj;

  if (typeof obj === 'symbol') throw new TypeError();

  return obj.toString();
}
