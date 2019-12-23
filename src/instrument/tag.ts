import { ImmutableTag } from './immutable-tag';
import { Comparable } from '../utils/comparable';

export interface Tag extends Comparable<Tag> {
  key: string;
  value: string;
}

export function tagOf(key: string, value: string) {
  return new ImmutableTag(key, value);
}

export function isTag(value: any): value is Tag {
  return (
    value && typeof value.key === 'string' && typeof value.value === 'string'
  );
}
