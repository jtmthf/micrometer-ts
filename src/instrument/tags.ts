import { Tag, isTag, tagOf } from './tag';
import { chunk, sortedUniqBy } from 'lodash-es';

export class Tags implements Iterable<Tag> {
  private static readonly EMPTY: Tags = new Tags([]);

  private readonly tags: Tag[];

  private constructor(tags: Tag[]) {
    this.tags = sortedUniqBy(tags, 'key');
  }

  and(...keyValues: string[]): Tags;
  and(...tags: Tag[]): Tags;
  and(tags?: Iterable<Tag>): Tags;
  and(...args: Array<string | Tag | Iterable<Tag> | undefined>): Tags {
    const [one] = args;
    if (isTag(one)) {
      return new Tags([...this.tags, ...(args as Tag[])]);
    }
    if (typeof one === 'string') {
      return this.and(Tags.of(...(args as string[])));
    }
    if (one === undefined) {
      return this;
    }
    return this.and(Tags.of(args as Iterable<Tag>).tags);
  }

  static concat(tags?: Iterable<Tag>, otherTags?: Iterable<Tag>): Tags;
  static concat(tags?: Iterable<Tag>, ...keyValues: string[]): Tags;
  static concat(
    tags?: Iterable<Tag>,
    ...args: Array<string | Iterable<Tag> | undefined>
  ): Tags {
    const [otherTags] = args;
    if (typeof otherTags !== 'string') {
      return Tags.of(tags).and(otherTags);
    }
    return Tags.of(tags).and(...(args as string[]));
  }

  static of(tags?: Iterable<Tag>): Tags;
  static of(...keyValues: string[]): Tags;
  static of(...tags: Tag[]): Tags;
  static of(...args: Array<string | Tag | Iterable<Tag> | undefined>): Tags {
    const [one] = args;
    if (isTag(one)) {
      return this.empty().and(...(args as Tag[]));
    }
    if (typeof one === 'string') {
      if (args.length % 2 === 1) {
        throw new Error('size must be even, it is a set of key=value pairs');
      }
      return new Tags(
        chunk(args as string[], 2).map(([key, value]) => tagOf(key, value)),
      );
    }
    if (one === undefined) {
      return this.empty();
    }
    const iteratorResult = one[Symbol.iterator]().next();
    const isEmpty = iteratorResult.done && iteratorResult.value === undefined;
    if (isEmpty) {
      return this.empty();
    }
    if (one instanceof Tags) {
      return one;
    } else if (Array.isArray(one)) {
      return new Tags(one);
    } else {
      return new Tags([...one]);
    }
  }

  static empty() {
    return this.EMPTY;
  }

  [Symbol.iterator](): Iterator<Tag> {
    return this.tags[Symbol.iterator]();
  }
}
