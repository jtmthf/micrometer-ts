import { AbstractMeter } from '../abstract-meter';
import { Measurement } from '../measurement';

export class NoopMeter extends AbstractMeter {
  measure(): Measurement[] {
    return [];
  }
}
