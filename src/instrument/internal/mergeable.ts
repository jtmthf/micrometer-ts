export interface Mergeable<T> {
  merge(parent: T): T;
}
