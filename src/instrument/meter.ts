import { Measurement } from './measurement';
import { Tags } from './tags';
import { Tag, isTag, tagOf } from './tag';
import { Statistic } from './statistic';
import { MeterRegistry } from './meter-registry';

export interface Meter {
  id: MeterId;
  measure(): Iterable<Measurement>;
  match<T>(vistitors: MeterMatchOptions<T>): T;
  use(vistitors: MeterUseOptions): void;
}

export enum MeterType {
  Counter,
  Gauge,
  LongTaskTimer,
  Timer,
  DistributionSummary,
  Other,
}

export class MeterId {
  private readonly tags: Tags;

  constructor(
    public readonly name: string,
    tags: Tags,
    public readonly baseUnit: string | undefined,
    public readonly description: string | undefined,
    public readonly type: MeterType,
    public readonly syntheticAssociation?: MeterId,
  ) {
    this.tags = tags;
  }

  withName(newName: string): MeterId {
    return new MeterId(
      newName,
      this.tags,
      this.baseUnit,
      this.description,
      this.type,
    );
  }

  withTag(tagOrStatistic: Tag | Statistic): MeterId {
    return this.withTags([
      isTag(tagOrStatistic)
        ? tagOrStatistic
        : tagOf('statistic', tagOrStatistic),
    ]);
  }

  withTags(tags: Iterable<Tag>): MeterId {
    return new MeterId(
      this.name,
      Tags.concat(this.tags, tags),
      this.baseUnit,
      this.description,
      this.type,
    );
  }

  replaceTags(tags: Iterable<Tag>): MeterId {
    return new MeterId(
      this.name,
      Tags.of(tags),
      this.baseUnit,
      this.description,
      this.type,
    );
  }

  withBaseUnit(newBaseUnit?: string) {
    return new MeterId(
      this.name,
      this.tags,
      newBaseUnit,
      this.description,
      this.type,
    );
  }

  getTags(): Tag[] {
    return [...this.tags];
  }

  getTagsAsIterable(): Iterable<Tag> {
    return this.tags;
  }

  getTag(key: string): string | undefined {
    for (const tag of this.tags) {
      if (tag.key === key) {
        return tag.value;
      }
    }
  }
}

export interface RegisterMeterOptions {
  name: string;
  type: MeterType;
  measurements: Iterable<Measurement>;
  tags?: Tags;
  description?: string;
  baseUnit?: string;
}

export interface MeterMatchOptions<T> {
  meter: (value: Meter) => T;
}

export interface MeterUseOptions {
  meter: (value: Meter) => void;
}

export function registerMeter(
  registry: MeterRegistry,
  {
    name,
    type,
    measurements,
    tags = Tags.empty(),
    description,
    baseUnit,
  }: RegisterMeterOptions,
): Meter {
  return registry.register(
    new MeterId(name, tags, baseUnit, description, type),
    type,
    measurements,
  );
}
