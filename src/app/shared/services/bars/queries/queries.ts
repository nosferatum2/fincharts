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

}

export class BarsQueryBuilder<T extends BaseBarsQueryParams> {

  protected instance: T;

  constructor(
    instance: T
  ) {
    this.createInstance(instance);
  }

  public withInstrumentId(instrumentId: string) {
    this.instance.instrumentId = instrumentId;
    return this;
  }

  public withProvider(provider: ProviderType) {
    this.instance.provider = provider;
    return this;
  }

  public withInterval(interval: number) {
    this.instance.interval = interval;
    return this;
  }

  public withPeriodicity(periodicity: IntervalType) {
    this.instance.periodicity = periodicity;
    return this;
  }

  public withBarsCount(barsCount: number) {
    if (this.instance instanceof CountBackQuery) {
      this.instance.barsCount = barsCount;
      return this;
    }

    throw new Error('withBarsCount() can only be used with CountBackQuery');
  }

  public withStartDate(startDate: string) {
    if (this.instance instanceof DateRangeQuery) {
      this.instance.startDate = startDate;
      return this;
    }

    throw Error('withStartDate() can only be used with DateRangeQuery');
  }

  public withEndDate(endDate: string) {
    if (this.instance instanceof DateRangeQuery) {
      this.instance.endDate = endDate;
      return this;
    }

    throw Error('withEndDate() can only be used with DateRangeQuery');
  }

  public withTimeBack(timeBack: string) {
    if (this.instance instanceof TimeBackQuery) {
      this.instance.timeBack = timeBack;
      return this;
    }

    throw Error('withTimeBack() can only be used with TimeBackQuery');
  }

  public build(): T {
    return this.instance;
  }

  private createInstance(query: QueryParams) {
    const {
      instrumentId,
      provider,
      interval,
      periodicity,
      barsCount,
      startDate,
      endDate,
      timeBack
    } = query;

    switch (true) {
      case barsCount !== undefined:
        this.instance = new CountBackQuery(
          instrumentId,
          provider,
          interval,
          periodicity,
          barsCount
        ) as unknown as T;
        break;
      case startDate !== undefined && endDate !== undefined:
        this.instance = new DateRangeQuery(
          instrumentId,
          provider,
          interval,
          periodicity,
          startDate,
          endDate
        ) as unknown as T;
        break;
      case timeBack !== undefined:
        this.instance = new TimeBackQuery(
          instrumentId,
          provider,
          interval,
          periodicity,
          timeBack
        ) as unknown as T;
        break;
      default:
        throw new Error('Invalid parameters for query creation');
    }
  }

}
