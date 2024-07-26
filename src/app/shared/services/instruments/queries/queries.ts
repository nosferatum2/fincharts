import { ProviderType } from '@shared/services/instruments/models/providers-data-view';

export class PagingQueryParams {

  page?: number;

  size?: number;

}

export class InstrumentsQuery extends PagingQueryParams {

  symbol?: string;

  provider?: ProviderType;

  kind?: string;

  exchange?: string;

  constructor(data?: Partial<InstrumentsQuery>) {
    super();
    Object.assign(this, data);
  }

}

export class InstrumentsQueryBuilder {

  symbol?: string;

  provider?: ProviderType;

  kind?: string;

  exchange?: string;

  page?: number;

  size?: number;

  public withPaging(page: number, size: number): InstrumentsQuery {
    this.page = page;
    this.size = size;
    return this;
  }

  public withSymbol(symbol: string): InstrumentsQuery {
    this.symbol = symbol;
    return this;
  }

  public withProvider(provider: ProviderType): InstrumentsQuery {
    this.provider = provider;
    return this;
  }

  public withKind(kind: string): InstrumentsQuery {
    this.kind = kind;
    return this;
  }

  public withExchange(exchange: string): InstrumentsQuery {
    this.exchange = exchange;
    return this;
  }

}

export class ExchangesQuery {

  protected provider?: ProviderType;

  withProvider(provider: ProviderType): ExchangesQuery {
    this.provider = provider;
    return this;
  }

}
