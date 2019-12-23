import { Tag } from './tag';
import { compareTo } from '../utils/comparable';
import { compare } from '../utils/compare';

export class ImmutableTag implements Tag {
  constructor(public readonly key: string, public readonly value: string) {}

  [compareTo](other: Tag): number {
    return compare(this.key, other.key);
  }
}
