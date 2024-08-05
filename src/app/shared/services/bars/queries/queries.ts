import { ProviderType } from '@shared/services/instruments/models/providers-data-view';
import { IntervalType } from '@shared/services/bars/models/queries';

interface QueryParams {
  instrumentId: string;
  provider: ProviderType;
  interval: number;
  periodicity: IntervalType;
  barsCount?: number;
  startDate?: string;
  endDate?: string;
  timeBack?: string;
}

abstract class BaseBarsQueryParams implements QueryParams {

  instrumentId: string;

  provider: ProviderType;

  interval: number;

  periodicity: IntervalType;

  protected constructor(
    instrumentId: string,
    provider: ProviderType,
    interval: number,
    periodicity: IntervalType,
  ) {
    this.instrumentId = instrumentId;
    this.provider = provider;
    this.interval = interval;
    this.periodicity = periodicity;
  }

  public withInstrumentId(instrumentId: string) {
    this.instrumentId = instrumentId;
    return this;
  }

  public withProvider(provider: ProviderType) {
    this.provider = provider;
    return this;
  }

  public withInterval(interval: number) {
    this.interval = interval;
    return this;
  }

  public withPeriodicity(periodicity: IntervalType) {
    this.periodicity = periodicity;
    return this;
  }

}

/**
 * Creates a new instance of the CountBackQuery class.
 *
 * @param {string} instrumentId - The ID of the instrument.
 * @param {ProviderType} provider - The type of the provider.
 * @param {number} interval - The interval.
 * @param {IntervalType} periodicity - The periodicity.
 * @param {number} barsCount - The number of records to return.
 */
export class CountBackQuery extends BaseBarsQueryParams {

  barsCount: number;

  constructor(
    instrumentId: string,
    provider: ProviderType,
    interval: number,
    periodicity: IntervalType,
    barsCount: number
  ) {
    super(instrumentId, provider, interval, periodicity);
    this.barsCount = barsCount;
  }

  public withBarsCount(barsCount: number) {
    this.barsCount = barsCount;
    return this;
  }

}

/**
 * Creates a new instance of the DateRangeQuery class.
 *
 * @param {string} instrumentId - The ID of the instrument.
 * @param {ProviderType} provider - The type of the provider.
 * @param {number} interval - The interval.
 * @param {IntervalType} periodicity - The periodicity.
 * @param {string} startDate - The start date of the range.
 * @param {string} endDate - The end date of the range.
 */
export class DateRangeQuery extends BaseBarsQueryParams {

  startDate: string;

  endDate: string;

  constructor(
    instrumentId: string,
    provider: ProviderType,
    interval: number,
    periodicity: IntervalType,
    startDate: string,
    endDate: string
  ) {
    super(instrumentId, provider, interval, periodicity);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public withStartDate(startDate: string) {
    this.startDate = startDate;
    return this;
  }

  public withEndDate(endDate: string) {
    this.endDate = endDate;
    return this;
  }

}

/**
 * Creates a new instance of the TimeBackQuery class.
 *
 * @param {string} instrumentId - The ID of the instrument.
 * @param {ProviderType} provider - The type of the provider.
 * @param {number} interval - The interval.
 * @param {IntervalType} periodicity - The periodicity.
 * @param {string} timeBack - The time back.
 */
export class TimeBackQuery extends BaseBarsQueryParams {

  timeBack: string;

  constructor(
    instrumentId: string,
    provider: ProviderType,
    interval: number,
    periodicity: IntervalType,
    timeBack: string
  ) {
    super(instrumentId, provider, interval, periodicity);
    this.timeBack = timeBack;
  }

  public withTimeBack(timeBack: string) {
    this.timeBack = timeBack;
    return this;
  }

}
