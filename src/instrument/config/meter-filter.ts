import { MeterId } from '../meter';
import { MeterFilterReply } from './meter-filter-reply';
import { DistributionStatisticConfig } from '../distribution';

export interface MeterFilter {
  accept(id: MeterId): MeterFilterReply;
  map(id: MeterId): MeterId;
  configure(
    id: MeterId,
    config: DistributionStatisticConfig,
  ): DistributionStatisticConfig | undefined;
}
