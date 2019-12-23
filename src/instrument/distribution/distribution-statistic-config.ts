import { Mergeable } from '../internal';

export class DistributionStatisticConfig
  implements Mergeable<DistributionStatisticConfig> {
  percentileHistogram?: boolean;
  percentiles?: number[];
  percentilePrecision?: number;
  sla?: number[];
  minimumExpectedValue?: number;
  maximumExpectedValue?: number;
  expiry?: number;
  bufferLength?: number;

  merge(parent: DistributionStatisticConfig): DistributionStatisticConfig {
    return DistributionStatisticConfig.from({
      percentileHistogram:
        this.percentileHistogram == null
          ? parent.percentileHistogram
          : this.percentileHistogram,
      percentiles:
        this.percentiles == null ? parent.percentiles : this.percentiles,
      sla: this.sla ? parent.sla : this.sla,
      percentilePrecision:
        this.percentilePrecision == null
          ? parent.percentilePrecision
          : this.percentilePrecision,
      minimumExpectedValue:
        this.minimumExpectedValue == null
          ? parent.minimumExpectedValue
          : this.minimumExpectedValue,
      maximumExpectedValue:
        this.maximumExpectedValue == null
          ? parent.maximumExpectedValue
          : this.maximumExpectedValue,
      expiry: this.expiry == null ? parent.expiry : this.expiry,
      bufferLength:
        this.bufferLength == null ? parent.bufferLength : this.bufferLength,
    });
  }

  static from(
    options: DistributionStatisticConfigOptions,
  ): DistributionStatisticConfig {
    return Object.assign(new DistributionStatisticConfig(), options);
  }
}

export interface DistributionStatisticConfigOptions {
  percentileHistogram?: boolean;
  percentiles?: number[];
  percentilePrecision?: number;
  sla?: number[];
  minimumExpectedValue?: number;
  maximumExpectedValue?: number;
  expiry?: number;
  bufferLength?: number;
}
