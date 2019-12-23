import { Meter, MeterId, MeterMatchOptions, MeterUseOptions } from './meter';
import { Measurement } from './measurement';

export abstract class AbstractMeter implements Meter {
  constructor(public readonly id: MeterId) {}

  abstract measure(): Iterable<Measurement>;

  match<T>({ meter }: MeterMatchOptions<T>): T {
    return meter(this);
  }

  use({ meter }: MeterUseOptions): void {
    meter(this);
  }
}
