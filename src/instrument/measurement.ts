import { Statistic } from './statistic';

export class Measurement {
  constructor(
    private readonly valueFunction: () => number,
    public readonly statistic: Statistic,
  ) {}

  getValue() {
    return this.valueFunction();
  }
}
