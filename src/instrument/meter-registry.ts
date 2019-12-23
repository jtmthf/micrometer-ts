import { Meter, MeterId, MeterType } from './meter';
import { Measurement } from './measurement';
import { NoopMeter } from './noop';
import { Type } from '../utils/types';
import { MeterFilter } from './config/meter-filter';
import { DistributionStatisticConfig } from './distribution';
import { MeterFilterReply } from './config/meter-filter-reply';

export abstract class MeterRegistry {
  private readonly filters: MeterFilter[] = [];
  private readonly meterAddedListeners: Array<(meter: Meter) => void> = [];
  private readonly meterRemovedListeners: Array<(meter: Meter) => void> = [];
  private meterMap = new Map<MeterId, Meter>();
  closed = false;

  register(
    id: MeterId,
    type: MeterType,
    measurements: Iterable<Measurement>,
  ): Meter {
    return this.registerMeterIfNecessary(
      undefined,
      id,
      id2 => this.newMeter(id2, type, measurements),
      id2 => new NoopMeter(id2),
    );
  }

  protected abstract newMeter(
    id: MeterId,
    type: MeterType,
    measurements: Iterable<Measurement>,
  ): Meter;

  private registerMeterIfNecessary<M extends Meter>(
    meterClass: Type<M> | undefined,
    id: MeterId,
    builder: (id: MeterId, conf?: DistributionStatisticConfig) => M,
    noopBuilder: (id: MeterId) => M,
    config?: DistributionStatisticConfig,
  ): M {
    const mappedId = this.getMappedId(id);
    const meter = this.getOrCreateMeter(
      config,
      builder,
      id,
      mappedId,
      noopBuilder,
    );

    if (meterClass && !(meter instanceof meterClass)) {
      throw new Error(
        'There is already a registered meter of a different type with the same name',
      );
    }
    return meter as M;
  }

  private getMappedId(id: MeterId): MeterId {
    if (id.syntheticAssociation) {
      return id;
    }
    return this.filters.reduce((mappedId, filter) => filter.map(mappedId), id);
  }

  private getOrCreateMeter(
    config: DistributionStatisticConfig | undefined,
    builder: (id: MeterId, conf?: DistributionStatisticConfig) => Meter,
    originalId: MeterId,
    mappedId: MeterId,
    noopBuilder: (id: MeterId) => Meter,
  ): Meter {
    let meter = this.meterMap.get(mappedId);

    if (meter === undefined) {
      if (this.closed) {
        return noopBuilder(mappedId);
      }

      if (!this.accept(originalId)) {
        return noopBuilder(mappedId);
      }

      if (config !== undefined) {
        for (const filter of this.filters) {
          const filteredConfig = filter.configure(mappedId, config);
          if (filteredConfig != undefined) {
            config = filteredConfig;
          }
        }
      }

      meter = builder(mappedId, config);

      const synAssoc = originalId.syntheticAssociation;
      if (synAssoc !== undefined) {
        const existingSynthetics =
          this.syntheticAssociations.get(synAssoc) ?? new Set();
      }

      for (const onAdd of this.meterAddedListeners) {
        onAdd(meter);
      }
      this.meterMap.set(mappedId, meter);
    }

    return meter;
  }

  private accept(id: MeterId): boolean {
    for (const filter of this.filters) {
      const reply = filter.accept(id);
      if (reply === MeterFilterReply.Deny) {
        return false;
      } else if (reply === MeterFilterReply.Accept) {
        return true;
      }
    }
    return true;
  }
}
